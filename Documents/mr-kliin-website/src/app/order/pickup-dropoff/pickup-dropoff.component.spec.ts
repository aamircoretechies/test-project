import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupDropoffComponent } from './pickup-dropoff.component';

describe('PickupDropoffComponent', () => {
  let component: PickupDropoffComponent;
  let fixture: ComponentFixture<PickupDropoffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickupDropoffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupDropoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
