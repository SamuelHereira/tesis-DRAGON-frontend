/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AlumnoService } from './alumno.service';

describe('Service: Alumno', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlumnoService]
    });
  });

  it('should ...', inject([AlumnoService], (service: AlumnoService) => {
    expect(service).toBeTruthy();
  }));
});
