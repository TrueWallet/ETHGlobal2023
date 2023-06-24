import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletBaseComponent } from './pages/wallet-base/wallet-base.component';

const routes: Routes = [{
  path: '',
  component: WalletBaseComponent
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletRoutingModule { }
