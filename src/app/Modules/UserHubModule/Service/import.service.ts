import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface RequerimientoIA {
  title: string;
  feedback: string;
  type_code: string;
}

export interface ResponseExcel {
  code: string;
  msg: string;
  result: RequerimientoIA[];
}

@Injectable({ providedIn: 'root' })
export class ImportService {
  private urlEndPoint: string = environment.apiUrl + '/imports';

  constructor(private http: HttpClient) {}

  importarDesdeExcel(archivo: File): Observable<ResponseExcel> {
    const formData = new FormData();
    formData.append('file', archivo);

    return this.http.post<ResponseExcel>(
      `${environment.apiUrl}/imports.php?action=importarExcel`,
      formData
    );
  }
}
