/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorRevisorJuegosAsignadosComponent } from './profesor-revisor-juegos-asignados.component';

describe('JuegosJugadosComponent', () => {
  let component: ProfesorRevisorJuegosAsignadosComponent;
  let fixture: ComponentFixture<ProfesorRevisorJuegosAsignadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfesorRevisorJuegosAsignadosComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorRevisorJuegosAsignadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
