import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWalletComponent } from './create-wallet.component';

describe('CreateWalletComponent', () => {
  let component: CreateWalletComponent;
  let fixture: ComponentFixture<CreateWalletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateWalletComponent]
    });
    fixture = TestBed.createComponent(CreateWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
