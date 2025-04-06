/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JuegosCreadosComponent } from './juegos-creados.component';

describe('JuegosCreadosComponent', () => {
  let component: JuegosCreadosComponent;
  let fixture: ComponentFixture<JuegosCreadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegosCreadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegosCreadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
