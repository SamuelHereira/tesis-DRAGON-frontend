import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../../../Service/profesor.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  constructor(private _profesprService : ProfesorService) { }

  juegos: any[] = [];
  displayedColumns: string[] = ['seleccion', 'id_juego', 'tipo', 'fecha_creacion', 'fecha_finalizacion', 'estado'];
  displayedColumns2: string[] =
    [
      'nombres',
      'apellidos',
      'puntaje',
      'tiempoInicio',
      'tiempoFin',
      'tiempoJuego',
      'aciertos',
      'errores'
    ];
  
   chartsData: any[] = [
    {
      labels: ['Red', 'Blue', 'Yellow'],
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ]
     },
   ];
  
  viewPdf: boolean = false;

  dataSource = new MatTableDataSource<any>(this.juegos);
  selection = new SelectionModel<any>(true, []);

  datosJuegosSeleccionados: any[] = [];
  
  ngOnInit() {
    this.buscarJuegos();
  }

  buscarJuegos() {
    const dataLocal = JSON.parse(localStorage.getItem('persona')!);
    const criteria = {
      id: dataLocal.id
    }
    this._profesprService.obtenerJuegosProfesor(criteria).subscribe(Response => {
      if(Response.msg == 'OK') {
        this.juegos = Response.result.map((data: any) => {
          switch (data.id_tipo_juego) {
            case "1":
              data.tipo_juego = 'tipo-juego.juego-1-title'
              break;
            case "2":
              data.tipo_juego = 'tipo-juego.juego-2-title'
              break;
            case "3":
              data.tipo_juego = 'tipo-juego.juego-3-title'
              break;
          };
          return data
        });
        this.juegos = this.juegos.filter((data : any) => data.estado == '0');
        this.dataSource = new MatTableDataSource<any>(this.juegos);
        this.selection = new SelectionModel<any>(true, []);
      }
    })
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  obtenerDatosReportes() {
    const criteria = this.selection.selected.map(data => {
        return {
            id_usuario: data.id_profesor,
            id_juego: data.id_juego
        }
    })
    this._profesprService.getTodosReportes(criteria).then(data => {
      let juegosTemp = [...data];
      juegosTemp = juegosTemp.filter(data => data.code == '200' && data.result.mensaje == 'OK');
      this.datosJuegosSeleccionados = juegosTemp.map(data => {
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
              tiempo: this.calculateTimeDifference(dataJson.hora_inicio, dataJson.hora_fin),
            }
          })
        }
      });
      if (this.duu === 0) {
    //     chartsData: any[] = [
    // {
    //   labels: ['Red', 'Blue', 'Yellow'],
    //   data: [300, 50, 100],
    //   backgroundColor: [
    //     'rgb(255, 99, 132)',
    //     'rgb(54, 162, 235)',
    //     'rgb(255, 205, 86)'
    //   ]
    //  },
    //     ];
        // this.chartsData = juegosTemp.map(data => {
        //     return {
        //       labels: ['Red', 'Blue', 'Yellow'],
        //       data: [300, 50, 100],
        //       backgroundColor: [
        //         'rgb(255, 99, 132)',
        //         'rgb(54, 162, 235)',
        //         'rgb(255, 205, 86)'
        //       ]
        //     }
        // });
        // this.chartsData.push(
        //   {
        //     labels: ['Red', 'Blue', 'Yellow'],
        //     data: [300, 50, 100],
        //     backgroundColor: [
        //       'rgb(255, 99, 132)',
        //       'rgb(54, 162, 235)',
        //       'rgb(255, 205, 86)'
        //     ]
        //   }
        // );
        this.viewPdf = true;
        setTimeout(() => {
          this.openPDF();
        }, 0);
      }
    })
  }

  duu = 0;
 public openPDF(): void {
    let DATA: any = document.getElementById('htmlData');

    const marginLeft = 15;
    const marginTop = 10;
    const marginRight = 15;
    const marginBottom = 10;

    html2canvas(DATA, { scale: 2, useCORS: true }).then((canvas) => {
      let pageWidth = 210; // A4 width in mm
      let pageHeight = 297; // A4 height in mm
      let fileWidth = pageWidth - marginLeft - marginRight;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;

      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = marginTop; // Starting Y position for the image

      if (fileHeight < pageHeight - marginTop - marginBottom) {
        PDF.addImage(FILEURI, 'PNG', marginLeft, position, fileWidth, fileHeight);
      } else {
        let heightLeft = fileHeight;
        let pageNumber = 0;

        while (heightLeft > 0) {
          if (pageNumber > 0) {
            PDF.addPage();
          }
          const topPosition = pageNumber * (pageHeight - marginTop - marginBottom) + marginTop;
          PDF.addImage(FILEURI, 'PNG', marginLeft, -topPosition, fileWidth, fileHeight);
          heightLeft -= (pageHeight - marginTop - marginBottom);
          pageNumber++;
        }
      }

      PDF.save('Reportes ' + this.formatDate(new Date()) + '.pdf');
    }).then( () => {
      this.viewPdf = false
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

}
