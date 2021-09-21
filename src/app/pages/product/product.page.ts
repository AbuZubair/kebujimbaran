import { Component, ViewChild } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from "../../services/storage/storage.service";
import { HttpService } from "../../services/http/http.service";
import { rest_api } from "../../config/restapi";
import { PhotoService } from "../../services/photo/photo.service";
import { SharedService } from "../../services/shared/shared.service";
import { LoadingController,ModalController  } from '@ionic/angular';
import { ModalsPage } from "../../components/detail-modals/modals.page";
import { ToastService } from '../../services/toast/toast.service';
import { DataService } from "../../services/data/data.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: 'app-product',
  templateUrl: 'product.page.html',
  styleUrls: ['product.page.scss']
})
export class ProductPage {

  @ViewChild('mySelect', { static: false }) selectRef: IonSelect;
  Arr = Array;
  today: Date = new Date
  tomorrow: Date = new Date(this.today.setDate(this.today.getDate() + 1));
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay:true,
    speed: 400    
  };
  customPopoverOptions: any = {
    header: 'Select your language',       
  };
  lang: string = 'id';
  searchplaceholder: string;
  data: Object;
  productData: Array<any> = [];
  pagingparam = {
    offset:50,
    page:1,
    category:'',
    search:'',
    lang:''
  }
  cart: Array<any> = [];
  loading: boolean = false;
  loadingDelivery: boolean = false;
  loadingSlider: boolean;
  searching: boolean = false;
  subtotal: number;
  subtotaldisc: number;
  totalQty: number;
  deliveryDate: any;
  deliveryDateString: string;
  slider: Array<any>;
  platform;

  constructor(
    private translate: TranslateService,
    private storage: StorageService,
    private http: HttpService,
    private photoServices: PhotoService,
    public sharedService: SharedService,
    public loadingController: LoadingController,
    public modalController: ModalController,
    public toast: ToastService,
    private dataService: DataService
  ) {    
    this.translate.get('searchplaceholder').subscribe((res: string) => {      
      this.searchplaceholder = res;      
    });   
    this.platform = this.sharedService.checkPlatform()
    this.getObserve()
  }

  ionViewWillEnter(){
    this.getLang()
    this.getData()
    this.getCart()    
    this.getDeliveryDate()
    this.getSlider()
  }

  getObserve(){
    this.dataService._cart.subscribe((res:any) => {      
      if(res || res==0)this.cart = res
    })

    this.dataService._subtotal.subscribe((res:any) => {      
      if(res || res==0)this.subtotal = res
    })

    this.dataService._subtotalDisc.subscribe((res:any) => {      
      if(res || res==0)this.subtotaldisc = res
    })

    this.dataService._totalQty.subscribe((res:any) => {     
      if(res || res==0)this.totalQty = res
    })
  }

  async getDeliveryDate(){
    this.loadingDelivery = true
    this.deliveryDate = await this.sharedService.deliveryDate()
    if(this.deliveryDate)this.deliveryDateString = this.getDeliveryDateString(this.deliveryDate)
    this.loadingDelivery = false
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

  async getData(){
    this.loading = true
    try {
      const fetched: any = await this.fetchData()
      if(fetched.status){    
        this.data = fetched.data
        var products: any = this.data['data'].map((item) => {
          item.rating_string_1 = parseInt(parseFloat(item.rating).toString().split('.')[0]);
          item.rating_string_2 = (parseFloat(item.rating).toString().split('.')[1])?1:0;
          item.rating_left = 5 - parseInt(item.rating_string_1) - item.rating_string_2;
          item.photo = (item.path_photo)?this.photoServices.getphoto(item.path_photo):'assets/imgs/product_default.png';
          item.harga_string = this.sharedService.numberWithCommas(item.harga)
          item.harga_discount_string = this.sharedService.numberWithCommas(item.harga_discount)
          
          return item
        })
        this.productData = products   
              
      }else{
        // this.toast.present(fetched.message)
      }
      this.loading = false
    } catch (error) {
      this.loading = false
      // this.toast.present(error.message)
    }
    
  }

  doRefresh(event){
    console.log('Begin async operation');

    setTimeout(() => {
      this.getData()
      event.target.complete();
    }, 500);
    
  }

  fetchData(){
    return new Promise((resolve,reject) => {
      this.http.get(rest_api.product,this.pagingparam) 
      .toPromise().then( (res:any) => {
        resolve(res)
      },(err) => {
        reject(err)
      });
    })   
  }

  async getSlider(){
    this.loadingSlider = true;
    let sldr = await this.storage.getCacheData('slider')
    if(sldr){
      let age = 3.6e+6
      if(this.storage.ageOfData(sldr.time,age)){
        this.slider = sldr.data
        this.loadingSlider = false
      }else{
        this.fetchSlider()
      }
    }else{
      this.fetchSlider()
    }
  }

  fetchSlider(){
    return new Promise((resolve,reject) => {
      this.http.get(rest_api.param,{ param:'slider' }) 
      .toPromise().then( (res:any) => {
        if(res.status){
          let data = res.data.map(el => {
            el.img = this.photoServices.getphoto(el.ref_value)
            return el
          })
          this.slider = data
          this.storage.storeDate(data,new Date(),'slider')  
          this.loadingSlider = false
        }
      },(err) => {
        console.log(err.message)
      });
    }) 
  }

  search(e){
    let val = e.detail.value;
    if(val!=''){
      this.searching = true;
      this.pagingparam.search = val;
      this.pagingparam.lang = this.lang;
      this.pagingparam.category = '';
      this.pagingparam.page = 1;
      this.getData();
    }else{
      this.resetSearch()
    }    
  }

  resetSearch(){
    this.searching = false;
    this.pagingparam.search = '';
    this.pagingparam.lang = '';
    this.pagingparam.category = '';
    this.pagingparam.page = 1;
    this.getData();
  }

  async getLang(){    
    let lang = await this.storage.get('lang')
    if(lang){
      this.lang = lang
      this.translate.use(this.lang)
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

  addCart(data){    
    data.qty = 1
    data.checked = true
    this.dataService.addCart(data)
  }

  checkCart(id){
    if(this.cart.length == 0)return true
    if(this.cart.findIndex((item) => item.id == id) == -1)return true
    return false
  }

  getQtyCart(id){    
    return this.cart.find((item) => item.id == id).qty
  }

  actQty(type,item){
    try {
      this.dataService.actQty(type,item)
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

  openSelect() {
    this.selectRef.open()
  }

  async changeLang(e){    
    this.lang = e.detail.value   
    this.translate.use(this.lang)    
    this.translate.get('searchplaceholder').subscribe((res: string) => {       
      this.searchplaceholder = res;      
    });
    this.storage.set('lang', this.lang)
    setTimeout(() => {
      this.getDeliveryDate()
    }, 500);
    
  }

  segmentChanged(ev: any) {
    let val = ev.detail.value;
    this.pagingparam.category = (val!='all')?val:'';
    this.getData()
  }

  async presentLoading() {
    let msg;
    this.translate.get('loading').subscribe((res: string) => {       
      msg = res;      
    });
    const loading = await this.loadingController.create({      
      message: msg,      
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  async presentModal(product) {
    const modal = await this.modalController.create({
      component: ModalsPage,
      cssClass: 'modal-container',
      showBackdrop: true,
      componentProps: {
        'product': product,    
      }
    });

    await modal.present();
    
  }

  loadData(event) {
    if(!this.data || this.data['last_page'] == this.data['current_page']){
      event.target.disabled = true;
    }else{
      setTimeout(async () => {
        let nextPage = this.data['current_page'] + 1
        this.pagingparam.page = nextPage
        const fetched: any = await this.fetchData()
        if(fetched.status){    
          this.data = fetched.data
          this.data['data'].forEach((item) => {
            item.rating_string_1 = parseInt(parseFloat(item.rating).toString().split('.')[0]);
            item.rating_string_2 = (parseFloat(item.rating).toString().split('.')[1])?1:0;
            item.rating_left = 5 - parseInt(item.rating_string_1) - item.rating_string_2;
            item.photo = (item.path_photo)?this.photoServices.getphoto(item.path_photo):'assets/imgs/product_default.png';
            item.harga_string = this.sharedService.numberWithCommas(item.harga)
            item.harga_discount_string = this.sharedService.numberWithCommas(item.harga_discount)
            this.productData.push(item);  
          })  
                   
          if (this.data['last_page'] == nextPage) {
            event.target.disabled = true;
          }
        }else{
          this.toast.present(fetched.message)
        }
        
        event.target.complete();
  
        
      }, 500);
    }
    
  }

}
