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
  selector: 'app-revisar-juego',
  templateUrl: './revisar-juego.component.html',
  styleUrls: ['./revisar-juego.component.scss'],
})
export class RevisarJuegoComponent implements OnInit {
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
    'fecha_creacion',
    'fecha_finalizacion',
    'revisiones',
    'options',
  ];
  view_req: boolean = false;
  ngOnInit() {
    this.buscarJuegos();
  }

  buscarJuegos() {
    const dataLocal = JSON.parse(localStorage.getItem('persona')!);
    this._reviewerService
      .obtenerJuegoRevisor(dataLocal.id)
      .subscribe((Response) => {
        if (Response.msg == 'OK') {
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
      '/home/revisor/' + juego.id_revisor_juego + '/revisar',
    ]);
  }
}
