import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletRoutingModule } from './wallet-routing.module';
import { WalletBaseComponent } from './pages/wallet-base/wallet-base.component';
import { WalletComponent } from './pages/wallet/wallet.component';
import { WalletGuardiansComponent } from './pages/wallet-guardians/wallet-guardians.component';


@NgModule({
  declarations: [
    WalletBaseComponent,
    WalletComponent,
    WalletGuardiansComponent
  ],
  imports: [
    CommonModule,
    WalletRoutingModule
  ]
})
export class WalletModule { }
