import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfesorService } from 'src/app/Modules/UserHubModule/Service/profesor.service';
import { ReviewerService } from '../../../Service/reviewer.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-revisores-juego',
  templateUrl: './revisores-juego.component.html',
})
export class RevisoresJuegoComponent implements OnInit {
  idJuego!: number;
  revisores: any[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'actions'];

  revisorSeleccionado: string = '';

  revisoresValidos: any[] = [];
  asignarRevisor: boolean = false;
  btnDisabled: boolean = true;

  eliminarRevisor: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private profesorService: ProfesorService,
    private reviewerService: ReviewerService,
    private cdr: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.idJuego = +this.route.snapshot.paramMap.get('id')!;
    this.obtenerRevisores();
  }

  ngOnChanges() {
    this.cdr.detectChanges();
  }

  obtenerRevisores() {
    this.reviewerService
      .obtenerRevisoresJuego(this.idJuego)
      .subscribe((res) => {
        this.revisores = res.result.map((revisor: any) => {
          return {
            id: revisor.idUsuario,
            nombre: `${revisor.nombres} ${revisor.apellidos}`,
          };
        });
        this.cdr.detectChanges();
      });
  }

  openModalAsignar() {
    this.asignarRevisor = true;
    this.reviewerService
      .obtenerRevisoresValidos(this.idJuego)
      .subscribe((res) => {
        this.revisoresValidos = res.result.map((revisor: any) => {
          return {
            code: revisor.idUsuario,
            name: `${revisor.nombres} ${revisor.apellidos}`,
          };
        });
        this.cdr.detectChanges();
      });
  }

  closeModalAsignar() {
    this.asignarRevisor = false;
    this.revisorSeleccionado = '';
  }

  asignar() {
    const payload = {
      id_juego: this.idJuego,
      id_usuario: Number(this.revisorSeleccionado),
    };

    this.reviewerService.asignarRevisor(payload).subscribe({
      next: (res) => {
        console.log('res', res);
        if (res.code !== '200') {
          this.openSnackBar(
            this._translateService.instant('Error al asignar revisor'),
            'custom-snackbar_fallido'
          );
        } else {
          this.openSnackBar(
            this._translateService.instant('Revisor asignado correctamente'),
            'custom-snackbar_exitoso'
          );
          this.closeModalAsignar();
          this.obtenerRevisores();
        }
      },
      error: (err) => {
        this.openSnackBar(
          this._translateService.instant('Error al asignar revisor'),
          'custom-snackbar_fallido'
        );
      },
    });
  }

  openModalEliminar(element: any) {
    console.log('element', element);
    this.eliminarRevisor = true;
    this.revisorSeleccionado = element;
    this.cdr.detectChanges();
  }

  closeModalEliminar() {
    this.eliminarRevisor = false;
    this.revisorSeleccionado = '';
  }

  eliminar() {
    this.reviewerService
      .eliminarRevisor({
        id_juego: this.idJuego,
        id_usuario: Number(this.revisorSeleccionado),
      })
      .subscribe({
        next: (res) => {
          if (res.code !== '200') {
            this.openSnackBar(
              this._translateService.instant('Error al eliminar revisor'),
              'custom-snackbar_fallido'
            );
          } else {
            this.openSnackBar(
              this._translateService.instant('Revisor eliminado correctamente'),
              'custom-snackbar_exitoso'
            );
            this.closeModalEliminar();
            this.obtenerRevisores();
          }
        },
        error: (err) => {
          this.openSnackBar(
            this._translateService.instant('Error al eliminar revisor'),
            'custom-snackbar_fallido'
          );
        },
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
}
