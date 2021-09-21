import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { rest_api } from 'src/app/config/restapi';
import { DataService } from 'src/app/services/data/data.service';
import { HttpService } from 'src/app/services/http/http.service';
import { PhotoService } from 'src/app/services/photo/photo.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ToastService } from 'src/app/services/toast/toast.service';

export interface DetailModel {
  order: any;
  order_detail: Array<any>;
  payment: any;
};

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})

export class OrderDetailPage implements OnInit {

  loading: boolean = false;
  q: string;
  order_no: string;
  data: DetailModel;
  labelFile: string;
  linkWa = "https://api.whatsapp.com/send/?phone=6281220190008&text="
  htmlToWa: string;
  fullLink: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public http: HttpService,
    public sharedService: SharedService,
    public photoServices: PhotoService,
    public platform: Platform,
    public toast: ToastService,
    public alertController: AlertController,
    public translate: TranslateService,
    public loadings: LoadingController,
    public navCtrl: NavController,
    private storage: StorageService,
    private dataService: DataService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      if(params){
        this.q = params.q
        this.order_no = params.order_no
      }
    });
    this.handlerBack()
   }

  ngOnInit() {
    this.getData()
  }

  ionViewWillEnter(){
    this.translate.get('buktitrf').subscribe((res: string) => {       
      this.labelFile = res;      
    });
    this.getLang()
  }

  handlerBack(){
    this.platform.backButton.subscribeWithPriority(0, () => {
      this.router.navigate(['']) 
    });
  }

  async getLang(){    
    let lang = await this.storage.get('lang')
    if(lang){
      this.translate.use(lang)
    }else{
      this.translate.use('id')
    }
  }
  
  getData(){
    this.loading = true
    let param = {
      q: this.q,
      order_no: this.order_no
    }
    this.http.get(rest_api.orderDetail,param) 
      .toPromise().then( (res:any) => {
        if(res.status){
          this.data = res.data
          if(this.data.payment['bukti_trf'])this.labelFile = this.data.payment['bukti_trf'].split('/')[2]
          this.data.order_detail = this.data.order_detail.map((item) => {
            item.photo = (item.path_photo)?this.photoServices.getphoto(item.path_photo):'assets/imgs/product_default.png';
            item.harga_string = this.sharedService.numberWithCommas(item.harga)
            item.harga_discount_string = this.sharedService.numberWithCommas(item.harga_discount)
            return item
          })
          this.dataService._ratingData.next(this.data.order_detail)
          this.dataService._ratingOrderData.next(this.data.order)

          this.htmlToWa = `Order No: ${this.order_no}`
          this.htmlToWa += "\n"
          this.htmlToWa += `Nama: ${this.data.order.fullname}`
          this.htmlToWa += "\n"
          this.htmlToWa += `No HP: ${this.data.order.phone}`
          this.htmlToWa += "\n"
          this.htmlToWa += `Alamat: ${this.data.order.address}`
          this.htmlToWa += "\n"
          this.htmlToWa += `Total: ${this.sharedService.formattingCurrency(this.data.payment.charge_amount)}`
          this.htmlToWa += "\n"
          let baseUrl = location.origin;
          this.htmlToWa += `Link: "${baseUrl}/order-detail?q=${this.q}&order_no=${this.order_no}"`
          this.fullLink = this.linkWa+encodeURIComponent(this.htmlToWa)
        }else{
          this.router.navigate([''])
        }
                
        this.loading = false
      },(err) => {
        console.log(err)
        this.router.navigate([''])
      });
  }

  doCancel(){
    this.presentLoading()
    let data = {
      order_no: this.order_no
    }

    this.http.post(rest_api.cancelOrder,data).
      subscribe(async(res:any) => {
        if(res.status){
          this.getData()
        }
        this.loadings.dismiss()
    },(err) => {
      this.toast.present(err.message)
      this.loadings.dismiss()
    })
  }

  async cancelOrder() {
    let confirm;
    let msg;
    this.translate.get('confirmation').subscribe((res: string) => {      
      confirm = res;      
    });
    this.translate.get('cancelOrder').subscribe((res: string) => {      
      msg = res;      
    });
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: confirm,
      message: msg + " ?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.doCancel()
          }
        }
      ]
    });

    await alert.present();
  }

  async presentLoading() {
    let msg;
    this.translate.get('loading').subscribe((res: string) => {       
      msg = res;      
    });
    const loading = await this.loadings.create({      
      message: msg,      
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  rating(){
    this.router.navigate(['/rating']);
  }

  selectImg(e){
    if(e.target.value){
      // console.log(e)
      this.uploadBT(e)  
    }
  }

  uploadBT(el){
    this.presentLoading()

    let file = el.target.files[0]

    const formData = new FormData(); 
    formData.append("file", file, file.name);
    formData.append("order_no", this.order_no);

    this.http.uploadFile(rest_api.uploadBT,formData).
      subscribe(async(res:any) => {
        if(res.status){
          this.translate.get('successUpload').subscribe((res: string) => {       
            this.toast.present(res)
          });
          this.labelFile = res.data
        }
        this.loadings.dismiss()
    },(err) => {
      console.log(err)
      this.loadings.dismiss()
    })
  }
  

}
