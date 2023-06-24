import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { finalize, from } from 'rxjs';
import { CreateWalletService } from '../../services/create-wallet.service';
import { RestoreWalletComponent } from '../../partials/restore-wallet/restore-wallet.component';

@Component({
  selector: 'app-create-wallet',
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.scss']
})
export class CreateWalletComponent {
  loading: boolean = false;

  constructor(
    private service: CreateWalletService,
    private dialog: MatDialog,
    private router: Router,
  ) {
  }

  createWallet() {
    this.loading = true;
    from(this.service.createWallet()).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => {
      this.router.navigate(['/'], {replaceUrl: true});
    });
  }

  restoreWallet() {
    this.dialog.open(RestoreWalletComponent, {
      width: '600px',
      maxWidth: 'calc(100% - 32px)',
      closeOnNavigation: true,
      disableClose: true
    });
  }

}
