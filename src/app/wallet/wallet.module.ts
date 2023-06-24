import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletRoutingModule } from './wallet-routing.module';
import { WalletBaseComponent } from './pages/wallet-base/wallet-base.component';


@NgModule({
  declarations: [
    WalletBaseComponent
  ],
  imports: [
    CommonModule,
    WalletRoutingModule
  ]
})
export class WalletModule { }
