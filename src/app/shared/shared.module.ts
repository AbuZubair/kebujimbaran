import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HideHeaderDirective } from '../directives/hide-header.directive';
import { ScrollbarDirective } from '../directives/scrollbar.directive';
import { LangPipe } from '../pipes/lang.pipe';


@NgModule({
  declarations: [HideHeaderDirective,ScrollbarDirective,LangPipe],
  exports: [HideHeaderDirective, ScrollbarDirective, LangPipe],
  imports: [
      CommonModule
  ]
})
export class SharedModule { }
