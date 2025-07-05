import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  JuegoRevisor,
  JuegoRevisorDecoded,
  RevisionRevisorResponse,
} from '../interfaces/reviewer.interface';
import { IResponse } from '../interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class ReviewerService {
  constructor(private http: HttpClient) {}
  private urlEndPoint: string = environment.apiUrl + '/home';

  obtenerRevisoresValidos(idJuego: number, rol: string): Observable<any> {
    const criteria = {
      action: 'obtenerRevisoresValidos',
      id_juego: idJuego,
      rol,
    };
    return this.http.post<any>(this.urlEndPoint, criteria);
  }

  obtenerRevisoresJuego(idJuego: number): Observable<any> {
    const criteria = {
      action: 'obtenerRevisores',
      id_juego: idJuego,
    };
    return this.http.post<any>(this.urlEndPoint, criteria);
  }

  asignarRevisor(criteria: {
    id_juego: number;
    id_usuario: number;
    action?: string;
  }): Observable<any> {
    criteria.action = 'asignarRevisor';
    return this.http.post<any>(this.urlEndPoint, criteria);
  }

  eliminarRevisor(criteria: {
    id_juego: number;
    id_usuario: number;
    action?: string;
  }): Observable<any> {
    criteria.action = 'eliminarRevisor';
    return this.http.post<any>(this.urlEndPoint, criteria);
  }

  obetenrJuegosRevisor(
    idUsuario: string
  ): Observable<IResponse<JuegoRevisor[]>> {
    const criteria = {
      action: 'getJuegosRevisor',
      id_usuario: idUsuario,
    };
    return this.http.post<any>(this.urlEndPoint, criteria);
  }

  obtenerJuegoRevisor(
    idRevisorJuego: string
  ): Observable<IResponse<JuegoRevisorDecoded>> {
    const criteria = {
      action: 'obtenerJuegoRevisor',
      id_revisor_juego: idRevisorJuego,
    };
    return this.http.post<any>(this.urlEndPoint, criteria);
  }

  enviarFeedbackRequerimiento(criteria: {
    action?: string;
    id_revisor_juego: string;
    id_requerimiento: number;
    titulo: string;
    retroalimentacion: string;
    tipo: string;
    no_feedback?: number;
    id_revision?: number;
  }): Observable<IResponse<any>> {
    criteria.action = 'postRevisarRequerimientoJuego';
    return this.http.post<IResponse<any>>(this.urlEndPoint, criteria);
  }

  obtenerJuegoProfesorRevisor(
    id_revisor_juego: string
  ): Observable<IResponse<JuegoRevisorDecoded>> {
    const criteria = {
      action: 'obtenerJuegoProfesorRevisor',
      id_revisor_juego: id_revisor_juego,
    };
    return this.http.post<IResponse<JuegoRevisorDecoded>>(
      this.urlEndPoint,
      criteria
    );
  }

  obtenerProfesorRevisionesRequerimiento(
    id_revisor_juego: string,
    id_requerimiento: string
  ): Observable<IResponse<RevisionRevisorResponse[]>> {
    const criteria = {
      action: 'obtenerProfesorRevisionesRequerimiento',
      id_revisor_juego: id_revisor_juego,
      id_requerimiento: id_requerimiento,
    };
    return this.http.post<IResponse<RevisionRevisorResponse[]>>(
      this.urlEndPoint,
      criteria
    );
  }

  revisarPorProfesorRevisor(criteria: {
    action?: string;
    id_revision_revisor_juego: string;
    id_revisor_juego: string;
    feedback: string;
    aprobado: number;
  }): Observable<IResponse<any>> {
    criteria.action = 'postRevisarPorProfesor';
    return this.http.post<IResponse<any>>(this.urlEndPoint, criteria);
  }

  obtenerReporteRevisionesPorEstudianteJuego(criteria: {
    action?: string;
    id_juego: number;
    id_estudiante: number;
  }): Observable<IResponse<any[]>> {
    criteria.action = 'reporteRevisionesPorRequerimientoYEstudiante';
    return this.http.post<IResponse<any[]>>(this.urlEndPoint, criteria);
  }
}
