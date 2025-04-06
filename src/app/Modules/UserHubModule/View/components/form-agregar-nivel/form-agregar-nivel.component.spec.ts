/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FormAgregarNivelComponent } from './form-agregar-nivel.component';

describe('FormAgregarNivelComponent', () => {
  let component: FormAgregarNivelComponent;
  let fixture: ComponentFixture<FormAgregarNivelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAgregarNivelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAgregarNivelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
