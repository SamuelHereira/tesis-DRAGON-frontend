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
  selector: 'app-revisar-juego',
  templateUrl: './revisar-juego.component.html',
  styleUrls: ['./revisar-juego.component.scss'],
})
export class RevisarJuegoComponent implements OnInit {
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
    'estado',
    'revisiones_profesores',
    'options',
  ];

  // revisar
  revisarModal: boolean = false;
  requerimientoIdSeleccionado: number = 0;
  requerimientoSeleccionado: Requerimiento & {
    revisado: boolean;
    id_revision?: number;
    revisiones_profesores?: any[];
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
      .obtenerJuegoRevisor(this.idRevisorJuego)
      .subscribe((response) => {
        if (response.msg == 'OK') {
          this.juego = response.result;
          this.requerimientos = response.result.json.requerimientos.map(
            (requerimiento) => {
              const id_revision = response.result.revisiones.find(
                (revision) =>
                  Number(revision.id_requerimiento) === Number(requerimiento.id)
              )?.id_revision_revisor_juego;

              return {
                ...requerimiento,
                revisado: Boolean(
                  response.result.revisiones.find(
                    (revision) =>
                      Number(revision.id_requerimiento) ===
                      Number(requerimiento.id)
                  )
                ),
                id_revision: id_revision,
                revisiones_profesores:
                  response.result.revisiones_profesor.filter(
                    (revision) =>
                      revision.id_revision_revisor_juego === id_revision
                  ),
              };
            }
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
    this.requerimientoIdSeleccionado = requerimientoId;
    this.requerimientoSeleccionado = this.requerimientos.find(
      (requerimiento) => requerimiento.id == requerimientoId.toString()
    )!;

    this.reviewRequerimiento = {
      id: this.requerimientoSeleccionado.id,
      titulo: this.requerimientoSeleccionado.requerimiento,
      retroalimentacion: this.requerimientoSeleccionado.retroalimentacion,
      tipo: this.requerimientoSeleccionado.opcionRequerimiento,
      id_revision: this.requerimientoSeleccionado.id_revision,
    };

    console.log(this.requerimientoSeleccionado);
    console.log('reviewRequerimiento', this.reviewRequerimiento);

    if (this.requerimientoSeleccionado.id_revision) {
      const revision = this.juego.revisiones.find(
        (revision) =>
          Number(revision.id_requerimiento) ===
          Number(this.requerimientoSeleccionado.id)
      );

      if (revision) {
        this.reviewRequerimiento.retroalimentacion = revision.retroalimentacion;
        this.reviewRequerimiento.titulo = revision.titulo;
        this.reviewRequerimiento.tipo = revision.tipo;
      }
    }

    this._cdr.detectChanges();
    this.revisarModal = true;
  }

  finalizarRevision() {
    const noFeedback =
      this.reviewRequerimiento.titulo ===
        this.requerimientoSeleccionado.requerimiento &&
      this.reviewRequerimiento.retroalimentacion ===
        this.requerimientoSeleccionado.retroalimentacion &&
      this.reviewRequerimiento.tipo ===
        this.requerimientoSeleccionado.opcionRequerimiento
        ? 1
        : 0;

    this._reviewerService
      .enviarFeedbackRequerimiento({
        id_revisor_juego: this.idRevisorJuego,
        id_requerimiento: this.requerimientoIdSeleccionado,
        titulo: this.reviewRequerimiento.titulo,
        retroalimentacion: this.reviewRequerimiento.retroalimentacion,
        tipo: this.reviewRequerimiento.tipo,
        no_revision: noFeedback,
        id_revision: this.reviewRequerimiento.id_revision,
      })
      .subscribe((response) => {
        if (response.msg == 'OK') {
          this.openSnackBar(
            this._translateService.instant(
              'user-hub-module.revisar-juego.modal-revisar.success'
            ),
            'custom-snackbar_exitoso'
          );
          this.buscarJuegos();
          this.cancelarRevision();
        } else {
          this.openSnackBar(
            this._translateService.instant(
              'user-hub-module.revisar-juego.modal-revisar.error'
            ),
            'custom-snackbar_fallido'
          );
        }
      });
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
