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
  RevisionRevisorResponse,
} from '../../../interfaces/reviewer.interface';
import {
  DatosJuego,
  Nivel,
  Requerimiento,
} from '../../Model/requerimientos.model';

@Component({
  selector: 'app-profesor-revisar-revision',
  templateUrl: './profesor-revisar-revision.component.html',
  styleUrls: ['./profesor-revisar-revision.component.scss'],
})
export class ProfesorRevisarRevisionComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,

    private _router: Router,
    private _translateService: TranslateService,
    private _snackBar: MatSnackBar,
    private _reviewerService: ReviewerService,
    private _cdr: ChangeDetectorRef
  ) {}
  idRevisorJuego: string = '';
  idRequerimiento: string = '';
  revisiones: RevisionRevisorResponse[] = null!;

  requerimientos: (Requerimiento & {
    revisado: boolean;
    id_revision?: number;
  })[] = [];
  displayedColumns: string[] = [
    'position',
    'estudiante',
    'fecha',
    'titulo',
    'tipo',
    'feedback',
    'changes',
    'revisados',
    'options',
  ];

  // revisar
  revisarModal: boolean = false;
  requerimientoIdSeleccionado: number = 0;
  requerimientoSeleccionado: RevisionRevisorResponse & {
    revisado?: boolean;
    id_revision?: number;
  } = null!;
  comentario: string = '';

  ngOnInit() {
    this.idRevisorJuego = this.route.snapshot.paramMap.get('id')!;
    this.idRequerimiento = this.route.snapshot.paramMap.get('position')!;

    this.buscarRevisiones();
    this._cdr.detectChanges();
  }

  buscarRevisiones() {
    this._reviewerService
      .obtenerProfesorRevisionesRequerimiento(
        this.idRevisorJuego,
        this.idRequerimiento
      )
      .subscribe((response) => {
        if (response.msg == 'OK') {
          this.revisiones = response.result;
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

  revisar(id_revision_revisor_juego: string) {
    this.revisarModal = true;
    this.requerimientoIdSeleccionado = Number(id_revision_revisor_juego);
    this.requerimientoSeleccionado = this.revisiones.find(
      (revisar) =>
        revisar.id_revision_revisor_juego == id_revision_revisor_juego
    )!;
    console.log('revisar', this.requerimientoSeleccionado);
  }

  finalizarRevision(aprobado: number) {
    this._reviewerService
      .revisarPorProfesorRevisor({
        id_revisor_juego: this.idRevisorJuego,
        id_revision_revisor_juego:
          this.requerimientoSeleccionado.id_revision_revisor_juego,
        aprobado: aprobado,
        feedback: this.comentario,
      })
      .subscribe({
        next: (response) => {
          if (response.code == '200') {
            this.openSnackBar(
              'Revisión finalizada con éxito',
              'custom-snackbar_exitoso'
            );
            this.revisarModal = false;
            this.requerimientoIdSeleccionado = 0;

            this.comentario = '';

            this.buscarRevisiones();
            this._cdr.detectChanges();
          } else {
            this.openSnackBar(
              'Error al finalizar la revisión',
              'custom-snackbar_fallido'
            );
          }
        },
        error: (error) => {
          this.openSnackBar(
            'Error al finalizar la revisión',
            'custom-snackbar_fallido'
          );
        },
      });
  }
}
