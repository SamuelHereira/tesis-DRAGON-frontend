import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JuegoRevisor } from '../interfaces/reviewer.interface';
import { IResponse } from '../interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class ReviewerService {
  constructor(private http: HttpClient) {}
  private urlEndPoint: string = environment.apiUrl + '/home';

  obtenerRevisoresValidos(idJuego: number): Observable<any> {
    const criteria = {
      action: 'obtenerRevisoresValidos',
      id_juego: idJuego,
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
  ): Observable<IResponse<JuegoRevisor>> {
    const criteria = {
      action: 'obtenerJuegoRevisor',
      id_revisor_juego: idRevisorJuego,
    };
    return this.http.post<any>(this.urlEndPoint, criteria);
  }
}
