import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletRoutingModule } from './wallet-routing.module';
import { WalletBaseComponent } from './pages/wallet-base/wallet-base.component';
import { WalletComponent } from './pages/wallet/wallet.component';
import { WalletGuardiansComponent } from './pages/wallet-guardians/wallet-guardians.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WalletService } from './services/wallet.service';
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTableModule } from "@angular/material/table";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { SendComponent } from './partials/send/send.component';
import {MatSelectModule} from "@angular/material/select";
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    WalletBaseComponent,
    WalletComponent,
    WalletGuardiansComponent,
    SendComponent
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
    MatTableModule,
    ClipboardModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    MatSnackBarModule
  ],

  providers:[
    WalletService
  ]
})
export class WalletModule { }
