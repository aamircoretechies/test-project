import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutMrKliinComponent } from './about-mr-kliin.component';

describe('AboutMrKliinComponent', () => {
  let component: AboutMrKliinComponent;
  let fixture: ComponentFixture<AboutMrKliinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutMrKliinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutMrKliinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
