/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorRevisarJuegoComponent } from './profesor-revisar-juego.component';

describe('RevisarJuegoComponent', () => {
  let component: ProfesorRevisarJuegoComponent;
  let fixture: ComponentFixture<ProfesorRevisarJuegoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfesorRevisarJuegoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorRevisarJuegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
