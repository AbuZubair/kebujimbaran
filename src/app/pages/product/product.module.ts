import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductPage } from './product.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { ProductPageRoutingModule } from './product-routing.module';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { SharedModule } from "../../shared/shared.module";

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
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ProductPageRoutingModule,
    FontAwesomeModule,
    TranslateModule.forChild({      
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
      }
    }),
    SharedModule
  ],
  declarations: [ProductPage]  ,
  providers: [StorageService]
})
export class ProductPageModule {}
