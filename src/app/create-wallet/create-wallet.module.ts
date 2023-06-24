import { CreateWalletService } from './services/create-wallet.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateWalletRoutingModule } from './create-wallet-routing.module';
import { CreateWalletComponent } from './pages/create-wallet/create-wallet.component';


@NgModule({
  declarations: [
    CreateWalletComponent
  ],
  imports: [
    CommonModule,
    CreateWalletRoutingModule
  ],
  providers: [
    CreateWalletService
  ]
})
export class CreateWalletModule { }
