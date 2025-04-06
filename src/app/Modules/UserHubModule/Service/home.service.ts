import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private http: HttpClient) {}
  private urlEndPoint: string = environment.apiUrl + '/home';
  //private urlEndPoint: string = 'http://franklinparrales.es/Grupo3_Backend/home';

  recuperarRegistro(criteria: any): Observable<any> {
    criteria.action = 'getUsuarios';
    return this.http.post<any>(this.urlEndPoint, criteria);
  }

  obtenerDatosPerfil(criteria: any): Observable<any> {
    criteria.action = 'obtenearDatosUsuarios';
    return this.http.post<any>(this.urlEndPoint, criteria);
  }

  editarPerfil(criteria: any): Observable<any> {
    criteria.action = 'editarPerfil';
    return this.http.post<any>(this.urlEndPoint, criteria);
  }

  // crearCuenta(criteria : any) : Observable<any> {
  //   return this.http.put<any>(this.urlEndPoint,criteria);
  // }
}
