import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
// import { StorageService } from "./services/storage.service";
import { Platform} from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{
  constructor(
    private platform: Platform,
    private translate: TranslateService,
    private storage: Storage
  ) {    
    this.initializeApp()
  }

  async initializeApp() {
    this.platform.ready().then(async () => {
      await this.storage.create()
      let lang = await this.storage.get('lang')        
      if(lang)
        this.translate.setDefaultLang(lang);      
    })   
  }
}
