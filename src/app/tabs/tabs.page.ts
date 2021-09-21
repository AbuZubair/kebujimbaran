import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    private router: Router
  ) {}

  goTo(link){
    this.router.navigate([`/${link}`])
  }

}
