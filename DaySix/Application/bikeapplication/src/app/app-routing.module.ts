import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
  { path: 'login-page', loadChildren: './pages/login-page/login-page.module#LoginPagePageModule' },
  { path: 'register-page', loadChildren: './pages/register-page/register-page.module#RegisterPagePageModule' },
  { path: 'payment-page', loadChildren: './payment-page/payment-page.module#PaymentPagePageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
