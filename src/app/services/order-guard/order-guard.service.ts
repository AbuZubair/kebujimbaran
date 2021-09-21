import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationEnd, RoutesRecognized } from '@angular/router';
import { Location } from '@angular/common';

import { DataService } from "../data/data.service";

import { Observable } from 'rxjs';
import { filter, pairwise, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderGuardService implements CanActivate {

  constructor(private router: Router, private dataService: DataService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.dataService.isOrder.pipe(
      take(1),
      map((res: any) => {
        if (!res) {
          this.router.navigate(['/cart']);
          return false;
        }
        return true;
      })
    );
  }

  
}
