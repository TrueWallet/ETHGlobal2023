import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: 'create',
  loadChildren: () => import('../create-wallet/create-wallet.module').then(m => m.CreateWalletModule)
}, {
  path: '',
  loadChildren: () => import('../wallet/wallet.module').then(m => m.WalletModule)
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
