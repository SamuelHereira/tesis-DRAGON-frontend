import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProfesorService } from '../../../Service/profesor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AlumnoService } from '../../../Service/alumno.service';
import { ReviewerService } from '../../../Service/reviewer.service';
import {
  JuegoRevisor,
  JuegoRevisorDecoded,
} from '../../../interfaces/reviewer.interface';
import {
  DatosJuego,
  Nivel,
  Requerimiento,
} from '../../Model/requerimientos.model';

@Component({
  selector: 'app-profesor-revisar-juego',
  templateUrl: './profesor-revisar-juego.component.html',
  styleUrls: ['./profesor-revisar-juego.component.scss'],
})
export class ProfesorRevisarJuegoComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,

    private _router: Router,
    private _translateService: TranslateService,
    private _snackBar: MatSnackBar,
    private _reviewerService: ReviewerService,
    private _cdr: ChangeDetectorRef
  ) {}
  idRevisorJuego: string = '';
  juego: JuegoRevisorDecoded = null!;

  requerimientos: (Requerimiento & {
    revisado: boolean;
    id_revision?: number;
  })[] = [];
  displayedColumns: string[] = [
    'position',
    'titulo',
    'tipo',
    'feedback',
    'options',
  ];

  // revisar
  revisarModal: boolean = false;
  requerimientoIdSeleccionado: number = 0;
  requerimientoSeleccionado: Requerimiento & {
    revisado: boolean;
    id_revision?: number;
  } = null!;
  reviewRequerimiento: {
    id: string;
    titulo: string;
    retroalimentacion: string;
    tipo: string;
    id_revision?: number;
  } = {
    id: '',
    titulo: '',
    retroalimentacion: '',
    tipo: '',
  };

  options_Requerimientos = [
    { name: 'tipo-juego.juego-1-subtitle-ambiguo', code: 'NFA' },
    { name: 'tipo-juego.juego-1-subtitle-noAmbiguo', code: 'NFN' },

    { name: 'tipo-juego.juego-2-subtitle-ambiguo', code: 'RF' },
    { name: 'tipo-juego.juego-2-subtitle-noAmbiguo', code: 'RNF' },

    { name: 'tipo-juego.juego-3-subtitle-ambiguo', code: 'FA' },
    { name: 'tipo-juego.juego-3-subtitle-noAmbiguo', code: 'FN' },
  ];

  ngOnInit() {
    this.idRevisorJuego = this.route.snapshot.paramMap.get('id')!;
    this.buscarJuegos();
    this._cdr.detectChanges();
  }

  buscarJuegos() {
    this._reviewerService
      .obtenerJuegoProfesorRevisor(this.idRevisorJuego)
      .subscribe((response) => {
        if (response.msg == 'OK') {
          this.juego = response.result;
          this.requerimientos = response.result.json.requerimientos.map(
            (requerimiento) => ({
              ...requerimiento,
              revisado: Boolean(
                response.result.revisiones.find(
                  (revision) =>
                    Number(revision.id_requerimiento) ===
                    Number(requerimiento.id)
                )
              ),
              id_revision: response.result.revisiones.find(
                (revision) =>
                  Number(revision.id_requerimiento) === Number(requerimiento.id)
              )?.id_revision_revisor_juego,
            })
          );
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

  cancelarRevision() {
    this.revisarModal = false;
    this.requerimientoIdSeleccionado = 0;
    this.reviewRequerimiento = {
      id: '',
      titulo: '',
      retroalimentacion: '',
      tipo: '',
    };
  }

  revisar(requerimientoId: number) {
    this._router.navigate([
      '/home/profesor-revisor/' +
        this.juego.id_revisor_juego +
        '/revisiones' +
        '/' +
        requerimientoId,
    ]);
  }

  getTipoRequerimientoText(tipo: string) {
    switch (tipo) {
      case 'FA':
        return this._translateService.instant(
          'tipo-juego.juego-3-subtitle-ambiguo'
        );
        break;
      case 'FNA':
        return this._translateService.instant(
          'tipo-juego.juego-3-subtitle-noAmbiguo'
        );
        break;
      case 'NFA':
        return this._translateService.instant(
          'tipo-juego.juego-1-subtitle-ambiguo'
        );
        break;
      case 'NFNA':
        return this._translateService.instant(
          'tipo-juego.juego-1-subtitle-noAmbiguo'
        );
        break;
      case 'RFA':
        return this._translateService.instant(
          'tipo-juego.juego-2-subtitle-ambiguo'
        );
        break;
      case 'RFNA':
        return this._translateService.instant(
          'tipo-juego.juego-2-subtitle-noAmbiguo'
        );
        break;
      default:
        return '';
    }
  }

  detectChanges() {
    this._cdr.detectChanges();
  }
}
