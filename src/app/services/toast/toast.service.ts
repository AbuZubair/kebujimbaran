import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastController: ToastController) { }

  async present(msg) {
    const toast = await this.toastController.create({
      cssClass: 'toast-custom-class',
      message: msg,
      duration: 2000,
    });
    toast.present();
  }

}
