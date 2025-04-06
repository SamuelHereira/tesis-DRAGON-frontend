import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  private urlEndPoint: string = environment.apiUrl + '/auth';
  //private urlEndPoint: string = 'https://seriusgameug.com/back_end/auth';

  login(criteria: any): Observable<any> {
    criteria.action = 'login';
    return this.http.post<any>(this.urlEndPoint, criteria);
  }

  crearCuenta(criteria: any): Observable<any> {
    return this.http.put<any>(this.urlEndPoint, criteria);
  }

  migracion(criteria: any): Observable<any> {
    criteria.action = 'migracion';
    return this.http.post<any>(this.urlEndPoint, criteria);
  }

  cambiarPassword(criteria: any): Observable<any> {
    criteria.action = 'cambiarPassword';
    return this.http.post<any>(this.urlEndPoint, criteria);
  }

  recuperarCuenta(criteria: any): Observable<any> {
    criteria.action = 'recuperarPassword';
    return this.http.post<any>(this.urlEndPoint, criteria);
  }
}
