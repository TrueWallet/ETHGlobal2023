import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletRoutingModule } from './wallet-routing.module';
import { WalletBaseComponent } from './pages/wallet-base/wallet-base.component';
import { WalletComponent } from './pages/wallet/wallet.component';
import { WalletGuardiansComponent } from './pages/wallet-guardians/wallet-guardians.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WalletService } from './services/wallet.service';
import {MatCardModule} from "@angular/material/card";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTableModule} from "@angular/material/table";


@NgModule({
  declarations: [
    WalletBaseComponent,
    WalletComponent,
    WalletGuardiansComponent
  ],
  imports: [
    CommonModule,
    WalletRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatTableModule
  ],
  providers:[
    WalletService
  ]
})
export class WalletModule { }
