import { Component } from '@angular/core';
import { WalletService } from '../../services/wallet.service';
import { BehaviorSubject, from, Observable, switchMap, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-wallet-base',
  templateUrl: './wallet-base.component.html',
  styleUrls: ['./wallet-base.component.scss']
})
export class WalletBaseComponent {
  readonly wallet;
  private readonly refresh$$: BehaviorSubject<void> = new BehaviorSubject<void>(void 0);

  balance$: Observable<any>;
  constructor(private service: WalletService, private dialog: MatDialog) {
    this.wallet = this.service.walletAddress;
    this.balance$ = this.refresh$$.pipe(switchMap(() => from(this.service.getNativeBalance())));
  }
}
