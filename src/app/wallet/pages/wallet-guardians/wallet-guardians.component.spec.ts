import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletGuardiansComponent } from './wallet-guardians.component';

describe('WalletGuardiansComponent', () => {
  let component: WalletGuardiansComponent;
  let fixture: ComponentFixture<WalletGuardiansComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WalletGuardiansComponent]
    });
    fixture = TestBed.createComponent(WalletGuardiansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});