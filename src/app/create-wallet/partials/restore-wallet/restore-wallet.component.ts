import { Component } from '@angular/core';
import { finalize, from } from 'rxjs';
import { CreateWalletService } from '../../services/create-wallet.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-restore-wallet',
  templateUrl: './restore-wallet.component.html',
  styleUrls: ['./restore-wallet.component.scss']
})
export class RestoreWalletComponent {
  loading: boolean = false;

  wallet: string = '';
  isRequested: boolean = false;


  constructor(
    private service: CreateWalletService,
    private snackbar: MatSnackBar,
  ) {
  }

  restoreWallet() {
    this.loading = true;
    from(this.service.restoreWallet(this.wallet)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => {this.isRequested = true});
  }

  executeRestore() {
    this.loading = true;
    from(this.service.executeRestore(this.wallet)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => {
      this.snackbar.open(`Access to wallet ${this.wallet} restored`, 'OK');
    });
  }
}