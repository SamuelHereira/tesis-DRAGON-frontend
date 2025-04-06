/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UiKaasSliderComponent } from './ui-kaas-slider.component';

describe('UiKaasSliderComponent', () => {
  let component: UiKaasSliderComponent;
  let fixture: ComponentFixture<UiKaasSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiKaasSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiKaasSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
