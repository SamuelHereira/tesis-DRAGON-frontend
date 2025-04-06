/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CalendareComponent } from './calendare.component';

describe('CalendareComponent', () => {
  let component: CalendareComponent;
  let fixture: ComponentFixture<CalendareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
