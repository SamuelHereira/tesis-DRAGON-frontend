import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfesorService {
  constructor(private http: HttpClient) {}
  private urlEndPoint: string = environment.apiUrl + '/home';

  crearJuego(criteria: any): Observable<any> {
    criteria.action = 'crearJuego';
    return this.http.post<any>(this.urlEndPoint, criteria);
  }
  obtenerJuegosProfesor(criteria: any): Observable<any> {
    criteria.action = 'obtenerJuegosProfesor';
    return this.http.post<any>(this.urlEndPoint, criteria);
  }

  guardarRequerimiento(criteria: any): Observable<any> {
    const criteriaRequest = {
      action: 'guardarRequerimientos',
      requisitos: [...criteria],
    };
    return this.http.post<any>(this.urlEndPoint, criteriaRequest);
  }

  obtenerRequerimiento(): Observable<any> {
    const criteriaRequest = {
      action: 'obtenerRequerimientos',
    };
    return this.http.post<any>(this.urlEndPoint, criteriaRequest);
  }

  cerrarJuego(criteria: any): Observable<any> {
    criteria.action = 'cerrarJuego';
    return this.http.post<any>(this.urlEndPoint, criteria);
  }

  obtenerDatosReportes(criteria: any): Observable<any> {
    criteria.action = 'getDatosReporte';
    return this.http.post<any>(this.urlEndPoint, criteria);
  }

  getTodosReportes(criterios: any[]): Promise<any> {
    const observables = criterios.map((criterion) =>
      this.obtenerDatosReportes(criterion)
    );
    return forkJoin(observables).toPromise();
  }

  obtenerReporteRevisionEstudiante(criteria: any): Observable<any> {
    criteria.action = 'reporteRevisionesPorRequerimiento';
    return this.http.post<any>(this.urlEndPoint, criteria);
  }

  getReporteRevisionEstudiante(criterios: any[]): Promise<any> {
    const observables = criterios.map((criterion) =>
      this.obtenerReporteRevisionEstudiante(criterion)
    );
    return forkJoin(observables).toPromise();
  }

  obtenerReporteRevisionProfesores(criteria: any): Observable<any> {
    criteria.action = 'reporteRevisionesProfesoresPorRevision';
    return this.http.post<any>(this.urlEndPoint, criteria);
  }

  getReporteRevisionProfesores(criterios: any[]): Promise<any> {
    const observables = criterios.map((criterion) =>
      this.obtenerReporteRevisionProfesores(criterion)
    );
    return forkJoin(observables).toPromise();
  }
}
