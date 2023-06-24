import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletBaseComponent } from './pages/wallet-base/wallet-base.component';
import { WalletComponent } from './pages/wallet/wallet.component';
import { WalletGuardiansComponent } from './pages/wallet-guardians/wallet-guardians.component';

const routes: Routes = [{
  path: '',
  component: WalletBaseComponent, children: [
    {
      path: '',
      pathMatch: 'full',
      component: WalletComponent
    },
    {
      path: 'guardians',
      component: WalletGuardiansComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletRoutingModule { }
