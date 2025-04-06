/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UiChargeComponent } from './ui-charge.component';

describe('UiChargeComponent', () => {
  let component: UiChargeComponent;
  let fixture: ComponentFixture<UiChargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiChargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
