/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisorJuegosAsignadosComponent } from './revisor-juegos-asignados.component';

describe('JuegosJugadosComponent', () => {
  let component: RevisorJuegosAsignadosComponent;
  let fixture: ComponentFixture<RevisorJuegosAsignadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RevisorJuegosAsignadosComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisorJuegosAsignadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
