import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { config } from '../../config/config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  api = '/api/';  
  url;

  constructor(private http: HttpClient) {
    if (config.port != '') {
      this.url = config.baseUrl + ':' + config.port + this.api;
    } else {
      this.url = config.baseUrl + this.api;
    }
  }

  post(endpoint, data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8; multipart/form-data'
      //'Access-Control-Allow-Origin': '*'
    });
    return this.http.post<any>(this.url + endpoint, data, { headers: headers });
  }

  post_request(endpoint, data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded;'
    });

    return this.http.post<any>(this.url + endpoint + '?' + data, { headers: headers });
  }

  post_body(endpoint, data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    });

    return this.http.post<any>(this.url + endpoint, data, { headers: headers }).pipe(map(e => { return e }));
  }

  uploadFile(endpoint, data)
  {
      return this.http.post(this.url + endpoint,data)
  }

  get(endpoint,param={}) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8;',           
      'Access-Control-Allow-Origin': '*'
    });

    let httpParams = new HttpParams();
    Object.keys(param).forEach(function (key) {
      if(param[key]!='')httpParams = httpParams.append(key, param[key])
    });

    return this.http.get<any>(this.url + endpoint, { headers: headers,params: httpParams }).pipe(map(e => { return e }));
  }

}
