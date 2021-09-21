import { Component, OnInit,Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from 'src/app/services/data/data.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { StorageService } from "../../services/storage/storage.service";

@Component({
  selector: 'app-modals',
  templateUrl: './modals.page.html',
  styleUrls: ['./modals.page.scss'],
})
export class ModalsPage implements OnInit {

  @Input() product: any;
  Arr = Array;
  subtotal: number;
  subtotaldisc: number;
  totalQty: number;
  cart: Array<any> = [];

  constructor(
    public modalController: ModalController,
    private storage: StorageService,
    private dataService: DataService,
    private translate: TranslateService,
    public toast: ToastService,
  ) { }

  ngOnInit() {
    this.getObserve
    this.getCart()
  }

  getObserve(){
    this.dataService._subtotal.subscribe((res) => {      
      if(res)this.subtotal = res
    })

    this.dataService._subtotalDisc.subscribe((res) => {      
      if(res)this.subtotaldisc = res
    })

    this.dataService._totalQty.subscribe((res) => {      
      if(res)this.totalQty = res
    })
  }

  async getCart(){
    this.dataService._cart.subscribe((data) => {
      if(data)this.cart = data
    })
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

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true,
    });
  }

}
