import {Component, Inject} from '@angular/core';
import {WalletService} from "../../services/wallet.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {catchError, finalize, from, throwError} from "rxjs";

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent {

  feeOptions = [{
    type: 'native',
    label: 'Native',
  }, {
    type: 'erc20',
    label: 'ERC20 Token',
  }, {
    type: 'sponsor',
    label: 'Sponsor',
  }]

  data = {
    to: '',
    amount: '',
    selectedFee: this.feeOptions[0].type,
  };

  balance$: Promise<string>;
  loading: boolean = false;

  ticker = 'MATIC';

  constructor(
    private service: WalletService,
    @Inject(MAT_DIALOG_DATA) public coin: any,
    private ref: MatDialogRef<SendComponent>
  ) {
    if (this.coin) {
      this.ticker = coin.ticker;
      this.balance$ = this.service.getERC20Balance(coin);
    } else {
      this.balance$ = this.service.getNativeBalance();
    }
  }

  send(): void {
    this.loading = true;
    from(this.service.sendNative(this.data)).pipe(
      catchError((err) => {
        console.dir(err);
        return throwError(() => err)
      }),
      finalize(() => this.loading = false)
    ).subscribe(() => {
      this.ref.close();
    });
  }

  sendERC20(): void {
    this.loading = true;
    from(this.service.sendERC20(this.coin, this.data)).pipe(
      catchError((err) => {
        console.dir(err);
        return throwError(() => err);
      }),
      finalize(() => this.loading = false)
    ).subscribe(() => {
      this.ref.close();
    });
  }

}
