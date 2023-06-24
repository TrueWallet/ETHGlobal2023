import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, catchError, finalize, from, Observable, switchMap, throwError } from 'rxjs';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-wallet-guardians',
  templateUrl: './wallet-guardians.component.html',
  styleUrls: ['./wallet-guardians.component.scss']
})
export class WalletGuardiansComponent {
  form: FormGroup;
  get guardianControl()  {
    return this.form.get('guardian') as FormControl
  }

  reload$$: BehaviorSubject<void> = new BehaviorSubject<void>(void 0);
  loading: boolean = false;

  guardians$: Observable<any[]>;

  constructor(private fb: FormBuilder, private service: WalletService) {
    this.form = this.fb.group({
      guardian: new FormControl('', Validators.required)
    });

    this.guardians$ = this.reload$$.pipe(
      switchMap(() => from(this.service.getGuardians()))
    )
  }

  addGuardian(): void {
    this.loading = true;
    from(this.service.addGuardian(this.guardianControl.value)).pipe(
      catchError((err) => {
        console.dir(err);
        return throwError(() => err);
      }),
      finalize(() => this.loading = false)
    ).subscribe(() => {
      this.reload$$.next();
      this.guardianControl.reset();
    })
  }

  cancel(item: any) {
    this.loading = true;
    from(this.service.cancelGuardian(item)).pipe(
      catchError((err) => {
        console.dir(err);
        return throwError(() => err);
      }),
      finalize(() => this.loading = false)
    ).subscribe(() => {
      this.reload$$.next();
    })
  }
}