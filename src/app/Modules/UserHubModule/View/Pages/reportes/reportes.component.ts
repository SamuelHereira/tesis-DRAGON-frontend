import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../../../Service/profesor.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  ReporteRevisionEstudiante,
  ReporteStatus,
} from '../../../interfaces/reports.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent implements OnInit {
  constructor(
    private _profesprService: ProfesorService,
    private _translateService: TranslateService
  ) {}

  juegos: any[] = [];
  displayedColumns: string[] = [
    'seleccion',
    'id_juego',
    'tipo',
    'fecha_creacion',
    'fecha_finalizacion',
    'estado',
  ];
  displayedColumns2: string[] = [
    'nombres',
    'apellidos',
    'puntaje',
    'tiempoInicio',
    'tiempoFin',
    'tiempoJuego',
    'aciertos',
    'errores',
  ];

  chartsData: any[] = [
    {
      labels: ['Red', 'Blue', 'Yellow'],
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
      ],
    },
  ];

  viewPdf: boolean = false;
  loading: boolean = false;

  dataSource = new MatTableDataSource<any>(this.juegos);
  selection = new SelectionModel<any>(true, []);

  datosJuegosSeleccionados: any[] = [];
  datosJuegosSeleccionadosRevisionesEstudiantes: any[] = [];

  revisionesEstudiantesStatus: ReporteStatus<ReporteRevisionEstudiante> = {
    loading: false,
    viewPdf: false,
    juegosSeleccionados: [],
    displayedColumns: ['id', 'tipo', 'titulo', 'retroalimentacion'],
    displayedColumns2: [
      'revisor',
      'tipo',
      'titulo',
      'retroalimentacion',
      'fechaRevision',
      'noFeedback',
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

  revisionesProfesoresStatus: ReporteStatus<ReporteRevisionEstudiante> = {
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
    const criteria = {
      id: dataLocal.id,
    };
    this._profesprService
      .obtenerJuegosProfesor(criteria)
      .subscribe((Response) => {
        if (Response.msg == 'OK') {
          console.log('Response', Response);

          this.juegos = Response.result.map((data: any) => {
            switch (data.id_tipo_juego) {
              case '1':
                data.tipo_juego = 'tipo-juego.juego-1-title';
                break;
              case '2':
                data.tipo_juego = 'tipo-juego.juego-2-title';
                break;
              case '3':
                data.tipo_juego = 'tipo-juego.juego-3-title';
                break;
            }
            return data;
          });
          // por que se filtra por 0? el 1 es el juego activo y el 0 es el juego inactivo
          this.juegos = this.juegos.filter((data: any) => data.estado == '1');
          this.dataSource = new MatTableDataSource<any>(this.juegos);
          this.selection = new SelectionModel<any>(true, []);
        }
      });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  obtenerDatosReportes() {
    this.loading = true;
    const criteria = this.selection.selected.map((data) => {
      return {
        id_usuario: data.id_profesor,
        id_juego: data.id_juego,
      };
    });
    this._profesprService
      .getTodosReportes(criteria)
      .then((data) => {
        let juegosTemp = [...data];
        juegosTemp = juegosTemp.filter(
          (data) => data.code == '200' && data.result.mensaje == 'OK'
        );
        this.datosJuegosSeleccionados = juegosTemp.map((data) => {
          const jsonTemp = JSON.parse(data.result.data);
          return {
            id_juego: jsonTemp[0].id_juego,
            puntajes: jsonTemp.map((dataJson: any) => {
              return {
                nombres: dataJson.nombres,
                apellidos: dataJson.apellidos,
                puntaje: dataJson.puntaje,
                hora_inicio: dataJson.hora_inicio,
                hora_fin: dataJson.hora_fin,
                aciertos: dataJson.aciertos,
                errores: dataJson.errores,
                tiempo: this.calculateTimeDifference(
                  dataJson.hora_inicio,
                  dataJson.hora_fin
                ),
              };
            }),
          };
        });
        if (this.duu === 0) {
          this.viewPdf = true;
          setTimeout(() => {
            this.openPDF();
          }, 0);
        }
      })
      .catch((error) => {
        this.loading = false;
      });
  }

  duu = 0;
  public openPDF(): void {
    let DATA: any = document.getElementById('htmlData');

    const marginLeft = 15;
    const marginTop = 10;
    const marginRight = 15;
    const marginBottom = 10;

    html2canvas(DATA, { scale: 2, useCORS: true })
      .then((canvas) => {
        let pageWidth = 210; // A4 width in mm
        let pageHeight = 297; // A4 height in mm
        let fileWidth = pageWidth - marginLeft - marginRight;
        let fileHeight = (canvas.height * fileWidth) / canvas.width;

        const FILEURI = canvas.toDataURL('image/png');
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = marginTop; // Starting Y position for the image

        if (fileHeight < pageHeight - marginTop - marginBottom) {
          PDF.addImage(
            FILEURI,
            'PNG',
            marginLeft,
            position,
            fileWidth,
            fileHeight
          );
        } else {
          let heightLeft = fileHeight;
          let pageNumber = 0;

          while (heightLeft > 0) {
            if (pageNumber > 0) {
              PDF.addPage();
            }
            const topPosition =
              pageNumber * (pageHeight - marginTop - marginBottom) + marginTop;
            PDF.addImage(
              FILEURI,
              'PNG',
              marginLeft,
              -topPosition,
              fileWidth,
              fileHeight
            );
            heightLeft -= pageHeight - marginTop - marginBottom;
            pageNumber++;
          }
        }

        PDF.save('Reportes ' + this.formatDate(new Date()) + '.pdf');
      })
      .then(() => {
        this.viewPdf = false;
        this.loading = false;
      })
      .catch((error) => {
        this.viewPdf = false;
        this.loading = false;
      });
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

  calculateTimeDifference(startTime: string, endTime: string): number {
    const start = new Date(`1970-01-01T${startTime}Z`);
    const end = new Date(`1970-01-01T${endTime}Z`);
    const differenceInMilliseconds = end.getTime() - start.getTime();
    const differenceInSeconds = differenceInMilliseconds / 1000;
    return differenceInSeconds;
  }

  obtenerRevisionesEstudiantes() {
    this.revisionesEstudiantesStatus.loading = true;
    const criteria = this.selection.selected.map((data) => {
      return {
        id_usuario: data.id_profesor,
        id_juego: data.id_juego,
      };
    });
    this._profesprService
      .getReporteRevisionEstudiante(criteria)
      .then((data) => {
        let juegosTemp = [...data];
        console.log('juegosTemp', juegosTemp);
        juegosTemp = juegosTemp
          .filter((data) => data.code == '200' && data.msg == 'OK')
          .map((res) => res.result);

        console.log('juegosTemp', juegosTemp);

        this.revisionesEstudiantesStatus.juegosSeleccionados = juegosTemp;
        this.revisionesEstudiantesStatus.viewPdf = true;
        setTimeout(() => {
          this.openPDFRevisionesEstudiantes();
        }, 0);
      })
      .catch((error) => {
        this.revisionesEstudiantesStatus.viewPdf = false;
        this.revisionesEstudiantesStatus.loading = false;
      });
  }

  openPDFRevisionesEstudiantes(): void {
    try {
      let DATA: any = document.getElementById('htmlDataRevisionesEstudiantes');

      const marginLeft = 15;
      const marginTop = 10;
      const marginRight = 15;
      const marginBottom = 10;

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
        this.revisionesEstudiantesStatus.juegosSeleccionados = [];
        this.revisionesEstudiantesStatus.loading = false;
      });
    } catch (error) {
      this.revisionesEstudiantesStatus.loading = false;
      this.revisionesEstudiantesStatus.viewPdf = false;
      this.revisionesEstudiantesStatus.juegosSeleccionados = [];
    }
  }

  obtenerRevisionesProfesores() {
    this.revisionesProfesoresStatus.loading = true;
    const criteria = this.selection.selected.map((data) => {
      return {
        id_usuario: data.id_profesor,
        id_juego: data.id_juego,
      };
    });
    this._profesprService
      .getReporteRevisionProfesores(criteria)
      .then((data) => {
        let juegosTemp = [...data];
        console.log('juegosTemp', juegosTemp);
        juegosTemp = juegosTemp
          .filter((data) => data.code == '200' && data.msg == 'OK')
          .map((res) => res.result);

        this.revisionesProfesoresStatus.juegosSeleccionados = juegosTemp;
        this.revisionesProfesoresStatus.viewPdf = true;
        setTimeout(() => {
          this.openPDFRevisionesProfesores();
        }, 0);
      })
      .catch((error) => {
        this.revisionesProfesoresStatus.viewPdf = false;
        this.revisionesProfesoresStatus.loading = false;
      });
  }

  openPDFRevisionesProfesores(): void {
    try {
      let DATA: any = document.getElementById('htmlDataRevisionesProfesores');

      const marginLeft = 15;
      const marginTop = 10;
      const marginRight = 15;
      const marginBottom = 10;

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
          'Reportes Revisiones Profesores ' +
            this.formatDate(new Date()) +
            '.pdf'
        );
        this.revisionesProfesoresStatus.viewPdf = false;
        this.revisionesProfesoresStatus.juegosSeleccionados = [];
        this.revisionesProfesoresStatus.loading = false;
      });
    } catch (error) {
      console.log(
        'Error al generar el PDF de revisiones de profesores:',
        error
      );
      this.revisionesProfesoresStatus.viewPdf = false;
      this.revisionesProfesoresStatus.juegosSeleccionados = [];
      this.revisionesProfesoresStatus.loading = false;
    }
  }

  get labelGenerarReporte(): string {
    return !this.loading
      ? this._translateService.instant('general.boton-generar')
      : this._translateService.instant('reporte-revision-table.generando');
  }

  get labelGenerarReporteEstudiantes(): string {
    return !this.revisionesEstudiantesStatus.loading
      ? this._translateService.instant(
          'reporte-revision-table.generar-reporte-estudiantes'
        )
      : this._translateService.instant('reporte-revision-table.generando');
  }

  get labelGenerarReporteProfesores(): string {
    return !this.revisionesProfesoresStatus.loading
      ? this._translateService.instant(
          'reporte-revision-table.generar-reporte-profesores'
        )
      : this._translateService.instant('reporte-revision-table.generando');
  }
}
