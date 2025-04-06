/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UiKaasInputSelectComponent } from './ui-kaas-input-select.component';

describe('UiKaasInputSelectComponent', () => {
  let component: UiKaasInputSelectComponent;
  let fixture: ComponentFixture<UiKaasInputSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiKaasInputSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiKaasInputSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
