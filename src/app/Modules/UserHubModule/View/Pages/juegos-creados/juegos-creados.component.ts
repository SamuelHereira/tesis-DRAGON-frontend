import { Component, OnInit } from '@angular/core';
import { AlumnoService } from '../../../Service/alumno.service';
import { Router } from '@angular/router';
import { ProfesorService } from '../../../Service/profesor.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-juegos-creados',
  templateUrl: './juegos-creados.component.html',
  styleUrls: ['./juegos-creados.component.scss']
})
export class JuegosCreadosComponent implements OnInit {

  constructor(private _profesprService : ProfesorService, private _router: Router, private _translateService: TranslateService, private _snackBar: MatSnackBar) { }
  juegos: any[] = [];
  juegoSeleccionado: any = this.reiniciarDatos();

  requerimientos : any[] = [];
  displayedColumns: string[] = ['position', 'id_juego', 'tipo', 'fecha_creacion', 'fecha_finalizacion', 'estado', "acctions"];
  displayedColumns2: string[] = ['position', 'req', 'typeReq', 'ReqPlus', 'pts'];
  view_req: boolean = false;
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
        this.juegos = Response.result.map((data : any)=>{
          switch(data.id_tipo_juego) {
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
        })
      }
    })
  }

  elegirJuego(id: number) {
    const juego = this.juegos.find(data => data.id_juego == id);
    const jsonTemp = JSON.parse(juego.json);
    const juegoJson = jsonTemp[0].requerimientos.map((data:any)=> {
      return {
        requerimiento: data.requerimiento,
        retroalimentacion: data.retroalimentacion,
        opcionRequerimiento: data.opcionRequerimiento,
        puntosAdicionales: String(data.puntosAdicionales),
        requerimientoCompleto: "no"
      }
    });
    this.juegoSeleccionado = {
      id_juego: juego.id_juego,
      tipo_req: this._translateService.instant(juego.tipo_juego),
      fecha_creacion: new Date(juego.fecha_creacion).toISOString().split('T')[0],
      fecha_finalizacion: new Date(juego.fecha_finalizacion).toISOString().split('T')[0],
      estado:  this._translateService.instant((juego.estado == 1) ? 'general.acitvo' : 'general.inacitvo'),
      estado2:  (juego.estado == 1) ? 'general.acitvo' : 'general.inacitvo',
      requerimientos: [...juegoJson]
    }

    this.view_req = true;
  }

  regresarJuego() {
    this.view_req = false;
    this.juegoSeleccionado = this.reiniciarDatos();
  }

  reiniciarDatos() : any {
    return {
      id_juego: 0,
      tipo_req: "",
      fecha_creacion: "",
      fecha_finalizacion: "",
      estado: "",
      requerimientos : []
    }
  }

  cerrarViewReq() {
    this.view_req = false;
  }

  crearJuego() {
    this._router.navigateByUrl('/home/crear-juego');
  }

  cerrarJuego() {
    const dataLocal = JSON.parse(localStorage.getItem('persona')!);

    const criteria = {
      id_juego: Number(this.juegoSeleccionado.id_juego),
      id_profesor: dataLocal.id
    }
    
    this._profesprService.cerrarJuego(criteria).subscribe(data=>{
      if(data.msg == 'OK') {
        this.regresarJuego();
        this.buscarJuegos();
        this.openSnackBar(this._translateService.instant('general-msg.ok-cerrar-juego'),'custom-snackbar_exitoso');
      }
      else {
        this.openSnackBar(this._translateService.instant('general-msg.error-cerrar-juego'),'custom-snackbar_fallido');
      }
    })
  }

  openSnackBar(message: string, class_customer: string) {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    config.panelClass = [class_customer];
    this._snackBar.open(message,'',config);
  }

}
