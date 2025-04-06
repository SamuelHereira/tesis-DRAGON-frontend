import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AlumnoService {
  constructor(private http: HttpClient) {}
  private urlEndPoint: string = environment.apiUrl + '/home';
  //private urlEndPoint: string = 'http://franklinparrales.es/Grupo3_Backend/home';

  recuperarJuego(criteria: any): Observable<any> {
    criteria.action = 'obtenerJuego';
    return this.http.post<any>(this.urlEndPoint, criteria);
  }

  recuperJuegosPublicos() {
    const criteria = {
      action: 'obtenerJuegoPublicos',
    };
    return this.http.post<any>(this.urlEndPoint, criteria);
  }

  guardarPuntaje(criteria: any): Observable<any> {
    criteria.action = 'guardarPuntaje';
    return this.http.post<any>(this.urlEndPoint, criteria);
  }

  getJuegosJugados(criteria: any): Observable<any> {
    criteria.action = 'getJuegosJugados';
    return this.http.post<any>(this.urlEndPoint, criteria);
  }
}
