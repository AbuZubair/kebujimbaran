import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { StorageService } from "../../services/storage/storage.service";
import { SharedService } from "../../services/shared/shared.service";
import { DataService } from 'src/app/services/data/data.service';
import { TranslateService } from '@ngx-translate/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast.service';
import { HttpService } from 'src/app/services/http/http.service';
import { rest_api } from 'src/app/config/restapi';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  cart: Array<any> = [];
  error: Array<any> = [];
  // data: Array<any> = [];
  subtotal: number = 0;
  subtotaldisc: number = 0;
  totalQty: number = 0;
  gridCheckAll: boolean ;
  rowChecked: boolean = false;
  isSubmitted: boolean = false;
  dataForm : FormGroup;
  deliveryDate: any;
  deliveryDateString: string;
  productData: Array<any> = [];

  constructor(
    private storage: StorageService,
    public sharedService: SharedService,
    private dataService: DataService,
    private translate: TranslateService,
    public formBuilder: FormBuilder,
    public router: Router,
    public toast: ToastService,
    public http: HttpService,
    public loading: LoadingController
  ) {
    this.getObserve()
  }

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      fullname: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      // email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
    })
  }

  async ionViewWillEnter(){
    await this.getLang()
    this.getCart()
    this.getDeliveryDate()
  }

  ionViewWillLeave(){
    this.isSubmitted = false
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
      this.getProduct(cart)
    }
  }

  getProduct(cart){
    return new Promise<void>((resolve,reject) => {
      let param = {
        product_id: cart.map(item => { return item.id}).join()
      }
      this.http.get(rest_api.productById,param) 
      .toPromise().then( (res:any) => {
        if(res.status){
          this.productData = res.data
        }
        resolve()
      },(err) => {
        reject()
      });
    })
  }

  async getDeliveryDate(){
    this.deliveryDate = await this.sharedService.deliveryDate()
    this.deliveryDateString = this.getDeliveryDateString(this.deliveryDate)
  }

  getDeliveryDateString(dt){
    const dayNames_id = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu" ];
    const dayNames_en = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const date = dt;
    let days = (this.translate.currentLang=='id')?dayNames_id:dayNames_en
    return days[date.getDay()] + " " +('0' + date.getDate()).slice(-2) + " "
    + monthNames[date.getMonth()];
  }

  getObserve(){
    this.dataService._cart.subscribe((res) => {         
      if(res && res.length > 0){
        this.cart = res
        let check = this.cart.some(function(item){
          return item.checked === false
        })
        if(check){
          this.gridCheckAll = false
        }else{
          this.gridCheckAll = true
        }
      }
    })

    this.dataService._subtotal.subscribe((res) => {    
      if(res || res==0)this.subtotal = res
    })

    this.dataService._subtotalDisc.subscribe((res) => {      
      if(res || res==0)this.subtotaldisc = res
    })

    this.dataService._totalQty.subscribe((res) => {     
      if(res || res==0)this.totalQty = res
    })
  }

  actQty(type,item){
    try {
      let index = this.cart.findIndex(val => val == item)
      if(this.error[index])this.error[index] = null;
      let product = this.productData.find(val => val.id == item.id)
      this.dataService.actQty(type,product)
    } catch (error) {
      if(error.message == 'stock unavailable'){
        let msg;
        this.translate.get('stockUnvailable').subscribe((res: string) => {       
          msg = res;      
        });
        this.toast.present(msg)
      }
    }
  }

  checkAll(e) {  
    if(!this.rowChecked){
      this.cart = this.cart.map(item => {
        item.checked = e.target.checked;
        return item
      });
      this.dataService._cart.next(this.cart)
      this.storage.set('cart',this.cart)
    }
  }

  rowCheckBoxChecked(e){
    this.rowChecked = true
    if(!e.target.checked)this.gridCheckAll = false
    this.dataService.getHargaDiscount()
    this.dataService._cart.next(this.cart)
    this.storage.set('cart',this.cart)
    setTimeout(() => {
      this.rowChecked = false
    }, 100);
  }

  preventNumber(e){
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(e.charCode);

    if (!pattern.test(inputChar)) {
      e.preventDefault();
    }
  }

  get errorControl() {
    return this.dataForm.controls;
  }

  async save(){
    this.isSubmitted = true;
    if (!this.dataForm.valid) {
      return false;
    } else {
      this.presentLoading()

      let check = this.cart.every(function(item){
        return item.checked === false
      })
      if(check){
        this.loading.dismiss()
        let msg;
        this.translate.get('plsSelectCart').subscribe((res: string) => {      
          msg = res;      
        });  
        this.toast.present(msg)
        return false;
      }

      let checkStock = await this.checkStock()
      if(!checkStock){
        this.loading.dismiss()
        let msg;
        this.translate.get('plsCheckError').subscribe((res: string) => {      
          msg = res;      
        });  
        this.toast.present(msg)
        setTimeout(() => {
          this.gotoTop();
        }, 300);
        
        return checkStock;
      }

      this.dataForm.value.phone = this.sharedService.normalizeMsisdn(this.dataForm.value.phone)
      let order = this.dataForm.value
      order['deliveryDate'] = this.deliveryDate
      this.dataService._order.next(order)
      this.dataService.isOrder.next(true)
      this.loading.dismiss()
      this.router.navigate(['/confirmation'])
    }
  }

  async checkStock(){
    try {
      await this.getProduct(this.cart)
      let status = true;
      return new Promise((resolve) => {
        for (let index = 0; index < this.cart.length; index++) {
          let product = this.productData.find(val => val.id == this.cart[index].id);
          if(this.cart[index].qty > product.stock){
            status = false
            let msg;
            this.translate.get('remainStock',{value: product.stock}).subscribe((res: string) => {      
              msg = res;      
            });  
            this.error[index] = msg
          } 
          if(index == this.cart.length-1)resolve(status)       
        }
      })
    } catch (error) {
      this.toast.present(error)
      return false
    }
   
  }

  gotoTop() {
    document.querySelector('app-cart').querySelector('ion-content').scrollToTop();
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

}
