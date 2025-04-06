/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SeriosGameComponent } from './serios-game.component';

describe('SeriosGameComponent', () => {
  let component: SeriosGameComponent;
  let fixture: ComponentFixture<SeriosGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeriosGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriosGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
