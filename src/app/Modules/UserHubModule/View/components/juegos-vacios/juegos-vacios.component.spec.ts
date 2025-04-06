/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JuegosVaciosComponent } from './juegos-vacios.component';

describe('JuegosVaciosComponent', () => {
  let component: JuegosVaciosComponent;
  let fixture: ComponentFixture<JuegosVaciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegosVaciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegosVaciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
