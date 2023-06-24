import { Component } from '@angular/core';
import {BehaviorSubject, finalize, from, Observable, switchMap} from "rxjs";
import {WalletState} from "../../constants/wallet-state";
import {WalletService} from "../../services/wallet.service";

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent {

  protected readonly WalletState = WalletState;

  walletState$: Observable<WalletState>;
  deploying: boolean = false;

  reload$$: BehaviorSubject<void> = new BehaviorSubject<void>(void 0);


  constructor(private service: WalletService) {
    this.walletState$ = this.reload$$.pipe(switchMap(() => this.service.isDeployed()));
  }

  deployWallet(): void {
    this.deploying = true;
    from(this.service.deployWallet()).pipe(
      finalize(() => this.deploying = false),
    ).subscribe(() => {
      this.reload$$.next();
    });
  }

}
