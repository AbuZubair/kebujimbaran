import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { rest_api } from 'src/app/config/restapi';
import { DataService } from 'src/app/services/data/data.service';
import { HttpService } from 'src/app/services/http/http.service';
import { PhotoService } from 'src/app/services/photo/photo.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Storage } from '@ionic/storage-angular';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Location } from "@angular/common";
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { LimitModalsPage } from "../../components/limit-modals/limit-modals.page";

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss'],
})
export class ConfirmationPage implements OnInit {

  isShowPromo: boolean = false;
  isLoadingVoucher: boolean = false;
  cart: Array<any> = [];
  subtotal: number = 0;
  subtotaldisc: number = 0;
  totalQty: number = 0;
  voucher = {
    id:'',
    name:'',
    amount:0
  };

  grandTotal:number = 0;
  voucherCode: string;
  isCodeRequired: boolean = false;
  isCodeNotExist: boolean = false;
  msisdn:any;
  paymentMethod: string;
  msg: string;
  orderData: Object;

  constructor(
    private dataService: DataService,
    public sharedService: SharedService,
    private translate: TranslateService,
    private storage: StorageService,
    private _storage: Storage,
    private http: HttpService,
    public toast: ToastService,
    public activatedRoute: ActivatedRoute,
    public photoServices: PhotoService,
    public location: Location,
    public loading: LoadingController,
    public router: Router,
    public navCtrl: NavController,
    public modalController: ModalController
  ) { 
    this.getObserve()
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params) {
        this.msisdn = params.msisdn;
      }
    })
  }

  getObserve(){
    this.dataService._cart.subscribe((res) => {         
      if(res && res.length > 0){
        this.cart = res.map(item => {
          return item
        })
      }
    })

    this.dataService._subtotal.subscribe((res) => {  
      if(res || res==0)this.subtotal = res
    })

    this.dataService._subtotalDisc.subscribe((res) => {      
      if(res || res==0){
        this.subtotaldisc = res
        this.grandTotal = this.subtotaldisc
      }
    })

    this.dataService._totalQty.subscribe((res) => {     
      if(res || res==0)this.totalQty = res
    })

    this.dataService._order.subscribe((res) => {     
      if(res)this.orderData = res
    })
  }

  ionViewWillEnter(){
    this.getLang()
    this.getCart()
  }

  async getLang(){    
    let lang = await this.storage.get('lang')
    if(lang){
      this.translate.use(lang)
    }else{
      this.translate.use('id')
    }
  }

  async getCart(){
    let cart = await this.storage.get('cart')
    if(cart){
      await this.dataService._cart.next(cart)
      this.dataService.getHargaDiscount()
    }
  }

  ionViewWillLeave(){
    this.dataService.isOrder.next(false)
  }

  useVoucher(){
    this.isShowPromo = true
  }

  submitVoucher(){
    if(!this.voucherCode){
      this.isCodeRequired = true;
      return false;
    }

    this.isLoadingVoucher = true;

    this.http.post(rest_api.submitvoucher,{code: this.voucherCode, msisdn: this.orderData['phone']}).subscribe((result:any) => {
      if(result.status){
        let data = result.data
        if(data){
          this.voucher.id = data.id
          this.voucher.name = data.promo_name
          if(data.discount > 0){
            this.voucher.amount = this.grandTotal * (parseFloat(data.discount) / 100)
          }else{
            this.voucher.amount = parseFloat(data.discount_amount)
          }
          this.grandTotal = this.grandTotal - this.voucher.amount
          this.translate.get('successAddVoucher').subscribe((res: string) => {      
            this.msg = res;      
          });
          this.toast.present(this.msg)
        }else{
          this.isCodeNotExist = true
        }
      }else{
        this.toast.present(result.message)
      }
      this.isLoadingVoucher = false
    })
  }

  changeCode(e){
    if(e.detail.value!='')this.isCodeRequired = false;
    this.isCodeNotExist = false
  }

  order(){
    if(!this.paymentMethod){
      this.translate.get('plsChoosePayment').subscribe((res: string) => {      
        this.msg = res;      
      });
      this.toast.present(this.msg);
      return false;
    }

    if(this.paymentMethod == 'cod'){
      if(this.grandTotal < 50000){
        this.presentModal();
        return false;
      }
    }

    this.presentLoading()

    let data = {
      total: this.grandTotal,
      subtotal: this.subtotal,
      fullname: this.orderData['fullname'],
      phone: this.orderData['phone'],
      email: this.orderData['email'],
      address: this.orderData['address'],
      deliveryDate: this.formattingDate(this.orderData['deliveryDate']),
      paymentMethod: this.paymentMethod,
      detail: this.cart.filter(item => item.checked==true)
    }
    if(this.voucher.id)data['promoId'] = this.voucher.id

    this.http.post(rest_api.order,data).
      subscribe(async(res:any) => {
        if(res.status){
          await this._storage.clear();
          this.dataService.resetData();
          let data = res.data
          let navigationExtras: NavigationExtras = {
            queryParams: {
              q: data['q'],
              order_no: data['order_no']
            },
            replaceUrl: true
          };
          this.navCtrl.navigateRoot(['/order-detail'], 
            navigationExtras);
        }else{
          if(res.message == 'stock unvailable'){
            this.translate.get('stockHasBeenChanged').subscribe((res: string) => {      
              this.msg = res;      
            });
            this.toast.present(this.msg);
            this.location.back()
          }else{
            this.toast.present(res.message)   
          }       
        }
        this.loading.dismiss()
    }, err => {
      this.loading.dismiss()
    })
  }

  formattingDate(date){
    return date.getFullYear() + "-" + 
    ('0' + (date.getMonth()+1)).slice(-2) + "-" + 
    ('0' + date.getDate()).slice(-2);
  }

  async presentLoading() {
    let msg;
    this.translate.get('loading').subscribe((res: string) => {       
      msg = res;      
    });
    const loading = await this.loading.create({      
      message: msg,      
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: LimitModalsPage,
      cssClass: 'limitmodal-container',
      showBackdrop: true,
    });

    await modal.present();
    
  }

}
