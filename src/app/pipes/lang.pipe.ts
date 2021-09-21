import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'lang',
  pure: false
})
export class LangPipe implements PipeTransform {

  constructor(private translate: TranslateService){

  }

  transform(value: any, args: string): string {
    let lang = this.translate.currentLang   
    let string = value[args+'_'+lang]    
    return string;
  }

}
