import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { rest_api } from 'src/app/config/restapi';
import { DataService } from 'src/app/services/data/data.service';
import { HttpService } from 'src/app/services/http/http.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.page.html',
  styleUrls: ['./rating.page.scss'],
})
export class RatingPage implements OnInit {

  data: Array<any>
  order: Object
 
  constructor(
    private dataService: DataService,
    public translate: TranslateService,
    public toast: ToastService,
    public http: HttpService,
    public loading: LoadingController,
    public location: Location
  ) { }

  ngOnInit() {
    this.getData()
  }

  async getData(){
    this.order = await this.dataService._ratingOrderData.getValue()
    this.data = await this.dataService._ratingData.getValue()
    this.data = this.data.map(item => {
      item.rate = [false,false,false,false,false]
      return item
    })
  }

  rate(idx,id){
    let index = this.data.findIndex(i => i.id==id)
    for (let i = 0; i < this.data[index].rate.length; i++) {
      if(i <= idx)this.data[index].rate[i] = true
      else this.data[index].rate[i] = false      
    }
  }

  save(){
    let check = this.validation()
    let msg;
    if(check){
      this.translate.get('plsRate').subscribe((res: string) => {      
        msg = res;      
      });
      this.toast.present(msg);
      return false;
    }

    this.presentLoading()

    let data = {
      data: this.data,
      order: this.order
    }

    this.http.post(rest_api.rating,data).
      subscribe(async(res:any) => {
        if(res.status){
          this.translate.get('thksRate').subscribe((res: string) => {      
            msg = res;      
          });
          this.toast.present(msg);

          let newData = this.data.filter(i => {
            let some = i.rate.every(function (rt) {
              return rt == false;
            })
            if(some)return i
          })
          this.dataService._ratingData.next(newData)
          this.location.back()
        }
        this.loading.dismiss()
    })
  }

  validation(){
    let check = this.data.every(function(v){
      return v.rate.every(function(i){
        return i == false
      })      
    })
    return check
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
