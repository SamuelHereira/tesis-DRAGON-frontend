import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../../../Service/profesor.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AlumnoService } from '../../../Service/alumno.service';
import { ReviewerService } from '../../../Service/reviewer.service';
import { JuegoRevisor } from '../../../interfaces/reviewer.interface';
import {
  DatosJuego,
  Nivel,
  Requerimiento,
} from '../../Model/requerimientos.model';

@Component({
  selector: 'app-profesor-revisor-juegos-asignados',
  templateUrl: './profesor-revisor-juegos-asignados.component.html',
  styleUrls: ['./profesor-revisor-juegos-asignados.component.scss'],
})
export class ProfesorRevisorJuegosAsignadosComponent implements OnInit {
  constructor(
    private _router: Router,
    private _translateService: TranslateService,
    private _snackBar: MatSnackBar,
    private _reviewerService: ReviewerService
  ) {}
  juegos: JuegoRevisor[] = [];

  requerimientos: any[] = [];
  displayedColumns: string[] = [
    'position',
    'id_juego',
    'nombre_profesor',
    'fecha_creacion',
    'fecha_finalizacion',
    'options',
  ];
  view_req: boolean = false;
  ngOnInit() {
    this.buscarJuegos();
  }

  buscarJuegos() {
    const dataLocal = JSON.parse(localStorage.getItem('persona')!);
    this._reviewerService
      .obetenrJuegosRevisor(dataLocal.id)
      .subscribe((Response) => {
        if (Response.msg == 'OK') {
          this.juegos = Response.result.map((data: JuegoRevisor) => {
            const nivel = JSON.parse(data.json) as Nivel[];
            const totalRequerimientos = nivel?.[0]?.requerimientos?.length || 0;

            return {
              ...data,
              total_requerimientos: totalRequerimientos,
            };
          });
        }
      });
  }

  openSnackBar(message: string, class_customer: string) {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    config.panelClass = [class_customer];
    this._snackBar.open(message, '', config);
  }

  revisarJuego(juego: JuegoRevisor) {
    this._router.navigate([
      '/home/profesor-revisor/' + juego.id_revisor_juego + '/revisiones',
    ]);
  }
}
