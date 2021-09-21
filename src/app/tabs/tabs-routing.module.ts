import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'home',
    component: TabsPage,
    children: [
      {
        path: 'product',
        loadChildren: () => import('../pages/product/product.module').then(m => m.ProductPageModule)
      },      
      {
        path: 'help',
        loadChildren: () => import('../pages/help/help.module').then( m => m.HelpPageModule)
      },
      {
        path: '',
        redirectTo: '/home/product',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home/product',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
