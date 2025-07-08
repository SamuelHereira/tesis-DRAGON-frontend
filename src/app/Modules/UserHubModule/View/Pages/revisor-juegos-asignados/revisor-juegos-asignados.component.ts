import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import {
  ReporteRevisionEstudiante,
  ReporteStatus,
} from '../../../interfaces/reports.interface';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-revisor-juegos-asignados',
  templateUrl: './revisor-juegos-asignados.component.html',
  styleUrls: ['./revisor-juegos-asignados.component.scss'],
})
export class RevisorJuegosAsignadosComponent implements OnInit {
  constructor(
    private _router: Router,
    private _translateService: TranslateService,
    private _snackBar: MatSnackBar,
    private _reviewerService: ReviewerService,

    private _cdr: ChangeDetectorRef
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

  revisionesEstudiantesStatus: ReporteStatus<ReporteRevisionEstudiante> = {
    loading: false,
    viewPdf: false,
    juegosSeleccionados: [],
    displayedColumns: [
      'revisor',
      'tipo',
      'titulo',
      'retroalimentacion',
      'fechaRevision',
      'noFeedback',
    ],
    displayedColumns2: [
      'revisor',
      'retroalimentacion',
      'fechaRevision',
      'aprobado',
    ],

    chartsData: [
      {
        labels: ['Red', 'Blue', 'Yellow'],
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
        ],
      },
    ],
  };

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
      '/home/revisor/' + juego.id_revisor_juego + '/revisar-juego',
    ]);
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  obtenerRevisionesEstudiantes(id_juego: number) {
    const dataLocal = JSON.parse(localStorage.getItem('persona')!);

    const criteria = {
      id_juego: id_juego,
      id_estudiante: dataLocal.id,
    };
    this._reviewerService
      .obtenerReporteRevisionesPorEstudianteJuego(criteria)
      .subscribe({
        next: (response) => {
          if (response.code === '200' && response.msg === 'OK') {
            this.revisionesEstudiantesStatus = {
              ...this.revisionesEstudiantesStatus,
              juegosSeleccionados: [response.result as any],
              viewPdf: true,
            };

            console.log('Revisiones Estudiantes', response.result);

            this.openPDFRevisionesEstudiantes();
          } else {
            this.openSnackBar(
              'No se encontraron revisiones para el estudiante seleccionado.',
              'error-snackbar'
            );
          }
        },
        error: (error) => {
          console.error('Error al obtener revisiones:', error);
          this.openSnackBar(
            'Error al obtener las revisiones del estudiante.',
            'error-snackbar'
          );
        },
      });
    // .then((data) => {
    //   let juegosTemp = [...data];
    //   console.log('juegosTemp', juegosTemp);
    //   juegosTemp = juegosTemp
    //     .filter((data) => data.code == '200' && data.msg == 'OK')
    //     .map((res) => res.result);

    //   console.log('juegosTemp', juegosTemp);

    //   this.revisionesEstudiantesStatus.juegosSeleccionados = juegosTemp;
    //   this.revisionesEstudiantesStatus.viewPdf = true;
    //   setTimeout(() => {
    //     this.openPDFRevisionesEstudiantes();
    //   }, 0);
    // });
  }

  openPDFRevisionesEstudiantes(): void {
    console.log('openPDFRevisionesEstudiantes');
    try {
      this._cdr.detectChanges();
      let DATA: any = document.getElementById('htmlDataRevisionesEstudiantes');

      const marginLeft = 15;
      const marginTop = 10;
      const marginRight = 15;
      const marginBottom = 10;

      console.log('DATA', DATA);

      html2canvas(DATA, { scale: 2, useCORS: true }).then((canvas) => {
        const imgWidth = 210 - marginLeft - marginRight; // A4 - márgenes
        const pageHeight = 297 - marginTop - marginBottom; // A4 - márgenes
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const totalPDFPages = Math.ceil(imgHeight / pageHeight);
        const PDF = new jsPDF('p', 'mm', 'a4');

        for (let i = 0; i < totalPDFPages; i++) {
          if (i > 0) PDF.addPage();

          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = (pageHeight * canvas.width) / imgWidth;

          const pageContext = pageCanvas.getContext('2d');
          if (pageContext) {
            pageContext.drawImage(
              canvas,
              0,
              i * pageCanvas.height, // origen Y en el canvas original
              canvas.width,
              pageCanvas.height,
              0,
              0,
              canvas.width,
              pageCanvas.height
            );

            const pageData = pageCanvas.toDataURL('image/png');

            PDF.addImage(
              pageData,
              'PNG',
              marginLeft,
              marginTop,
              imgWidth,
              pageHeight
            );
          }
        }

        PDF.save(
          'Reportes Revisiones Estudiantes ' +
            this.formatDate(new Date()) +
            '.pdf'
        );
        this.revisionesEstudiantesStatus.viewPdf = false;
      });
    } catch (error) {
      console.error(
        'Error al generar el PDF de revisiones de estudiantes:',
        error
      );
      this.revisionesEstudiantesStatus.viewPdf = false;
    }
  }
}
