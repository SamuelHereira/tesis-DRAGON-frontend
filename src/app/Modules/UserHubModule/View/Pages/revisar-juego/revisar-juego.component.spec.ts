/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisarJuegoComponent } from './revisar-juego.component';

describe('RevisarJuegoComponent', () => {
  let component: RevisarJuegoComponent;
  let fixture: ComponentFixture<RevisarJuegoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RevisarJuegoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisarJuegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
