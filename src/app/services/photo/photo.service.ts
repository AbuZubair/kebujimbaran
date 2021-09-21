import { Injectable } from '@angular/core';
import { config } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  url:string;

  constructor() {
    if (config.port != '') {
      this.url = config.baseUrl + ':' + config.port;
    } else {
      this.url = config.baseUrl;
    }
  }

  getphoto(file){
    let url = this.url+file;
    return url.replace(/\s/g, '');
  }
}
