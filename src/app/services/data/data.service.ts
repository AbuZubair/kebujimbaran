import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from "../../services/storage/storage.service";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public _cart = new BehaviorSubject<Array<any>>([]);
  public _subtotal = new BehaviorSubject<number>(0);
  public _subtotalDisc = new BehaviorSubject<number>(0);
  public _totalQty = new BehaviorSubject<number>(0);
  public _order = new BehaviorSubject<Object>({});
  public _ratingData = new BehaviorSubject([]);
  public _ratingOrderData = new BehaviorSubject({});
  private cart = []
  public isOrder = new BehaviorSubject(false);

  constructor(
    private platform: Platform,
    public storage: StorageService
  ) { 
    this._cart.subscribe((data) => {
      if(data)this.cart = data
    })
  }

  addCart(data){    
    data.qty = 1
    this.cart.push(data)    
    this.getHargaDiscount()
    this._cart.next(this.cart)
    this.storage.set('cart',this.cart)
  }

  actQty(type,product){
    if(type=='add'){
      let currentQty = this.cart.find(item => item.id == product.id).qty
      let addQty = currentQty + 1;
      if(addQty > product.stock){
        throw new Error("stock unavailable");
      }
      this.cart = this.cart.map((item) => {
        if(item.id == product.id)item.qty = addQty
        return item
      })
    }else{
      let idx = this.cart.findIndex((item) => item.id == product.id)
      if(this.cart[idx].qty == 1){
        this.cart.splice(idx, 1);
      }else{
        this.cart = this.cart.map((item) => {
          if(item.id == product.id)item.qty -= 1
          return item
        })
      }      
    }
    this.getHargaDiscount()
    this._cart.next(this.cart)
    this.storage.set('cart',this.cart)
  }

  getHargaDiscount(){  
    var total = 0
    var disc = 0
    var qty = 0
    const check = this.cart.every(function(item){
        return item.checked === false
    })
    if(check){
      this._subtotalDisc.next(0)
      this._subtotal.next(0)
      this._totalQty.next(0)
    }else{
      for (let index = 0; index < this.cart.length; index++) {
        if(this.cart[index].checked){
          qty += this.cart[index].qty
          total += parseFloat(this.cart[index].harga)*this.cart[index].qty
          if(this.cart[index].harga_discount == 0){
            disc += parseFloat(this.cart[index].harga)*this.cart[index].qty
          }else{
            disc += parseFloat(this.cart[index].harga_discount)*this.cart[index].qty
          } 
        }     
      }
      this._subtotalDisc.next(disc)
      this._subtotal.next(total)
      this._totalQty.next(qty)
    }
    
  } 

  resetData(){
    this._cart.next([])
    this._subtotalDisc.next(0)
    this._subtotal.next(0)
    this._totalQty.next(0)
    this._order.next({})
    this.isOrder.next(false)
  }
}
