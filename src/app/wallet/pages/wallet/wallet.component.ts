import { Component } from '@angular/core';
import {BehaviorSubject, finalize, from, Observable, switchMap} from "rxjs";
import {WalletState} from "../../constants/wallet-state";
import {WalletService} from "../../services/wallet.service";
import {environment} from "../../../../environments/environment";
import {MatDialog} from "@angular/material/dialog";
import {SendComponent} from "../../partials/send/send.component";

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent {

  protected readonly WalletState = WalletState;

  walletState$: Observable<WalletState>;
  deploying: boolean = false;

  balancesERC20$: Observable<any>;

  reload$$: BehaviorSubject<void> = new BehaviorSubject<void>(void 0);

  displayedColumns: string[] = ['name', 'balance', 'fiat', 'actions'];

  constructor(private service: WalletService, private dialog: MatDialog) {
    this.walletState$ = this.reload$$.pipe(switchMap(() => this.service.isDeployed()));
    this.balancesERC20$ = this.reload$$.pipe(switchMap(() => this.service.getBalancesERC20(environment.supportedERC20)));

  }

  deployWallet(): void {
    this.deploying = true;
    from(this.service.deployWallet()).pipe(
      finalize(() => this.deploying = false),
    ).subscribe(() => {
      this.reload$$.next();
    });
  }

  send(erc20: any): void {
    this.dialog.open(SendComponent, {
      width: '500px',
      data: erc20,
    }).afterClosed().subscribe(() => {
      this.reload$$.next();
    });
  }

}
