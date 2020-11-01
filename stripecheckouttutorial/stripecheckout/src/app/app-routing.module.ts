import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'payment-ok',
    loadChildren: () => import('./payment-ok/payment-ok.module').then( m => m.PaymentOKPageModule)
  },
  {
    path: 'payment-ko',
    loadChildren: () => import('./payment-ko/payment-ko.module').then( m => m.PaymentKOPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
