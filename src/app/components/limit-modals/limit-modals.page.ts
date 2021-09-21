import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-limit-modals',
  templateUrl: './limit-modals.page.html',
  styleUrls: ['./limit-modals.page.scss'],
})
export class LimitModalsPage implements OnInit {

  constructor(
    public modalController: ModalController,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true,
    });
  }

}
