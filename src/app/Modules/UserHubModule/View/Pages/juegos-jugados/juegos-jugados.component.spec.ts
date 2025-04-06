/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JuegosJugadosComponent } from './juegos-jugados.component';

describe('JuegosJugadosComponent', () => {
  let component: JuegosJugadosComponent;
  let fixture: ComponentFixture<JuegosJugadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegosJugadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegosJugadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
