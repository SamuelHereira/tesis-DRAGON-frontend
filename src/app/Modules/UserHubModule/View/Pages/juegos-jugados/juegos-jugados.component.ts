import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../../../Service/profesor.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AlumnoService } from '../../../Service/alumno.service';

@Component({
  selector: 'app-juegos-jugados',
  templateUrl: './juegos-jugados.component.html',
  styleUrls: ['./juegos-jugados.component.scss']
})
export class JuegosJugadosComponent implements OnInit {

  constructor(private _AlumnoService : AlumnoService, private _router: Router, private _translateService: TranslateService, private _snackBar: MatSnackBar) { }
  juegos: any[] = [];

  requerimientos : any[] = [];
  displayedColumns: string[] = ['position', 'id_juego', 'hora_inicio', 'hora_fin', 'tiempo', 'aciertos', 'errores', 'puntaje'];
  view_req: boolean = false;
  ngOnInit() {
    this.buscarJuegos();
  }

   buscarJuegos() {
    const dataLocal = JSON.parse(localStorage.getItem('persona')!);
    const criteria = {
      id: dataLocal.id
    }
    this._AlumnoService.getJuegosJugados(criteria).subscribe(Response => {
      if(Response.msg == 'OK') {
        this.juegos = Response.result.map((data : any) => {
          data.tiempo = this.calculateTimeDifference(data.hora_inicio, data.hora_fin)
          return data
        })
      }
    })
  }

  crearJuego() {
    this._router.navigateByUrl('/home/crear-juego');
  }

  openSnackBar(message: string, class_customer: string) {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    config.panelClass = [class_customer];
    this._snackBar.open(message,'',config);
  }

  calculateTimeDifference(startTime: string, endTime: string): number {
    const start = new Date(`1970-01-01T${startTime}Z`);
    const end = new Date(`1970-01-01T${endTime}Z`);
    const differenceInMilliseconds = end.getTime() - start.getTime();
    const differenceInSeconds = differenceInMilliseconds / 1000;
    return differenceInSeconds;
  }

}

