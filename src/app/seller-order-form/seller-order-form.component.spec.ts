import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerOrderFormComponent } from './seller-order-form.component';

describe('SellerOrderFormComponent', () => {
  let component: SellerOrderFormComponent;
  let fixture: ComponentFixture<SellerOrderFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerOrderFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
