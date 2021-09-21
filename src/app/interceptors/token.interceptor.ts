import { Inject,Injectable, InjectionToken } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable,of } from 'rxjs';
import { timeout,catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { ToastService } from '../services/toast/toast.service';
import { environment } from "../../environments/environment";

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public storage: Storage, @Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number, 
  public toast: ToastService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const time = Number(req.headers.get('timeout')) || this.defaultTimeout;
        const appkey = environment.appkey
        const today = new Date();
        const date = ('0' + today.getDate()).slice(-2)
                    + ('0' + (today.getMonth()+1)).slice(-2)
                    + today.getFullYear();  
        const token = btoa(date+appkey);
        
        req = req.clone({
          headers: req.headers.set('token-key', token)
        });

        return this.nextHand(next, req, time);
    }

    checkMessage(e: any) {
        // e == Error;
        if ('error' in e === true) {
          if ('message' in e.error === true) {
            return e.error.message;
          } else if ('error' in e.error === true) {
            // return e.error.error;
            return e.statusText;
          } else {
            if ('message' in e === true) {
              return e.message;
            } else {
              return 'Unauthorized : ';
            }
          }
        } else {
          if ('message' in e === true) {
            return e.message;
          } else {
            return 'Unauthorized : ';
          }
        }
    }
    
    checkRetry(msg: any, next: HttpHandler, req: HttpRequest<any>, time: any, lastresponse: any) {
        const str = msg.substring(0, 35) + '...';
        let choose;
        if (choose == true) {
          const newReq = req.clone();
          return this.nextHand(next, newReq, time);
        } else {
          const e = lastresponse
          this.showMessage(e)
          // return of(new HttpResponse({
          //   body: {
          //     status: false,
          //     statusCode: e.status,
          //     statusText: e.statusText,
          //   }
          // }))
        }
    }

    nextHand(next: HttpHandler, req: HttpRequest<any>, time: any) {
        return next.handle(req).pipe(timeout(time),catchError((e) => {
            const msg = this.checkMessage(e);
            return this.checkRetry(msg, next, req, time, e);
        }));
    }

    showMessage(response) {
        let str = ''
        let msg = ''
        switch (response.status) {
            case 401:
            case 403:
            msg = 'Status Code '
            str = response.status + ': ' + response.error.message
            break
            case 0:
            case undefined:
            msg = ''
            str = 'Server Unreachable'
            break
            default:
            msg = 'Status Code '
            str = response.status + ': ' + response.statusText
            break
        }
        msg = msg + str
        this.toast.present(msg)
    }
}