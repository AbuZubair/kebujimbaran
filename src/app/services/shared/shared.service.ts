import { Injectable } from '@angular/core';
import { rest_api } from 'src/app/config/restapi';
import { HttpService } from '../http/http.service';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public delivery = new BehaviorSubject(null);
  public todayDt = new BehaviorSubject(null);

  constructor(
    public http: HttpService,
    private platform: Platform,
  ) { }

  numberWithCommas(number) {
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts[0];
  }

  formattingCurrency(num){
    return num.toString().replace('.00','').replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  normalizeMsisdn(msisdn){
    let normalize = msisdn.substring(0,2)
    
    switch (normalize) {
      case '62':
        msisdn = msisdn
        break;
      case '08':
        msisdn = '62'+ msisdn.substring(1)
        break;
      // case '89':
      //   msisdn = '62'+ msisdn
      //   break;
      default:
        
        break;
    }

    return msisdn
  }

  getClosestDeliveryDate(){
    let today:any = new Date()
    return new Promise((resolve,reject) => {
      this.http.get(rest_api.param,{ param:'delivery_time' }) 
        .toPromise().then( (res:any) => {
          if(res.status){
            if(res.data.length > 0){
              let days = [];
              let diff = [];
              for (let index = 0; index < res.data.length; index++) {
                days[index] = res.data[index].ref_value
                diff[index] = (res.data[index].ref_value - parseInt(today.getDay()))        
              }
              let check = diff.some(function(el) { return el > 0 })
              let selectedDiff;
              if(check){
                selectedDiff = Math.min.apply(null, diff.filter(item => item>0))
              }else{
                selectedDiff = Math.min.apply(null, diff.filter(item => item!=0))
              }
              resolve(days[diff.findIndex(item => item==selectedDiff)]) 
            }else{
              resolve(false)
            }
                  
          }
        },(err) => {
          
      });
    })
  }

  async deliveryDate(){
    let today:any = new Date()
    let deliveryDay;
    if(!this.delivery.getValue()){
      deliveryDay = await this.getClosestDeliveryDate();
      this.delivery.next(deliveryDay)
      this.todayDt.next(today.getFullYear()+today.getMonth()+today.getDate())
    }else{
      if(this.todayDt.getValue() != today.getFullYear()+today.getMonth()+today.getDate()){
        deliveryDay = await this.getClosestDeliveryDate();
        this.delivery.next(deliveryDay)
        this.todayDt.next(today.getFullYear()+today.getMonth()+today.getDate())
      }else{
        deliveryDay = this.delivery.getValue()
      }
      
    }
    
    let d = parseInt(deliveryDay) - parseInt(today.getDay())
    const diff = (d > 0)?d: (7+d)
    const next = new Date(today.setDate(today.getDate() + diff));
    if(!deliveryDay)return false
    return next;
  }

  checkPlatform(){
    return (this.platform.is('ios')) ? 'iOS' : 'Android';
  }
}
