import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CreateWalletService } from './services/create-wallet.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateWalletRoutingModule } from './create-wallet-routing.module';
import { CreateWalletComponent } from './pages/create-wallet/create-wallet.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { RestoreWalletComponent } from './partials/restore-wallet/restore-wallet.component';
import {MatCardModule} from "@angular/material/card";


@NgModule({
  declarations: [
    CreateWalletComponent,
    RestoreWalletComponent,
  ],
  imports: [
    CommonModule,
    CreateWalletRoutingModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  providers: [
    CreateWalletService
  ]
})
export class CreateWalletModule { }
