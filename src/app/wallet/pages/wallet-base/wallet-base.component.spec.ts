import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletBaseComponent } from './wallet-base.component';

describe('WalletBaseComponent', () => {
  let component: WalletBaseComponent;
  let fixture: ComponentFixture<WalletBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WalletBaseComponent]
    });
    fixture = TestBed.createComponent(WalletBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
