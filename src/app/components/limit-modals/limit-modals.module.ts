import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LimitModalsPageRoutingModule } from './limit-modals-routing.module';

import { LimitModalsPage } from './limit-modals.page';

import {TranslateModule,TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {HttpClientModule, HttpClient} from '@angular/common/http';

import { StorageService } from "../../services/storage/storage.service";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    IonicModule,
    LimitModalsPageRoutingModule,
    TranslateModule.forChild({      
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
      }
    }),
  ],
  declarations: [LimitModalsPage]
})
export class LimitModalsPageModule {}
