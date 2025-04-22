import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisoresJuegoComponent } from './revisores-juego.component';

describe('RevisoresJuegoComponent', () => {
  let component: RevisoresJuegoComponent;
  let fixture: ComponentFixture<RevisoresJuegoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevisoresJuegoComponent]
    });
    fixture = TestBed.createComponent(RevisoresJuegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
