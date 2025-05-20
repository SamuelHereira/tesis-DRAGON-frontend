/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorRevisarRevisionComponent } from './profesor-revisar-revision.component';

describe('RevisarJuegoComponent', () => {
  let component: ProfesorRevisarRevisionComponent;
  let fixture: ComponentFixture<ProfesorRevisarRevisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfesorRevisarRevisionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorRevisarRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
