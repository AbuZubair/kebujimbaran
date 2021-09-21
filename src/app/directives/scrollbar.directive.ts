import { NgModule, Directive, ElementRef } from '@angular/core';
@Directive({
  selector: '[appScrollbarTheme]'
})
export class ScrollbarDirective {
  constructor(el: ElementRef) {
    const stylesheet = `
      ::-webkit-scrollbar {
        width: 1px;
      }
      ::-webkit-scrollbar-track {
      background: #ffff;
      }
      ::-webkit-scrollbar-thumb {
        border-radius: 1rem;
        background: linear-gradient(var(--ion-color-light-tint), var(--ion-color-light));
        border: 1px solid #bdbab5;
      }
      ::-webkit-scrollbar-thumb:hover {
      }
    `;
        
    const styleElmt = el.nativeElement.shadowRoot.querySelector('style');

    if(window.innerWidth >= 500){
      if (styleElmt) {
        styleElmt.append(stylesheet);
      } else {
        const barStyle = document.createElement('style');
        barStyle.append(stylesheet);
        el.nativeElement.shadowRoot.appendChild(barStyle);
      }
    }    
  }
}
