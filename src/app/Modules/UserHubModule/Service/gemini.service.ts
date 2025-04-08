import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface GeminiRequest {
  topic: string;
  gameMode: number;
}

export interface RequerimientoIA {
  title: string;
  feedback: string;
  type_code: string;
}

@Injectable({ providedIn: 'root' })
export class GeminiService {
  private urlEndPoint: string = environment.apiUrl + '/gemini';

  constructor(private http: HttpClient) {}

  generarRequerimientosPorIA(
    data: GeminiRequest
  ): Observable<RequerimientoIA[]> {
    return new Observable((observer) => {
      this.http.post<any>(this.urlEndPoint, data).subscribe({
        next: (res) => {
          try {
            observer.next(res);
            observer.complete();
          } catch (e) {
            observer.error('Error al parsear respuesta de Gemini.');
          }
        },
        error: (err) => observer.error(err),
      });
    });
  }
}
