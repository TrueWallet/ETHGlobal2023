import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, from } from 'rxjs';
import { CreateWalletService } from '../../services/create-wallet.service';

@Component({
  selector: 'app-create-wallet',
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.scss']
})
export class CreateWalletComponent {
  loading: boolean = false;

  constructor(
    private service: CreateWalletService,
    private router: Router
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

}
