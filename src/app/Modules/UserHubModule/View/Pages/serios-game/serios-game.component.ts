import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { AlumnoService } from '../../../Service/alumno.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Requerimiento } from '../../Model/requerimientos.model';
@Component({
  selector: 'app-serios-game',
  templateUrl: './serios-game.component.html',
  styleUrls: ['./serios-game.component.scss']
})
export class SeriosGameComponent implements OnInit{

  subs = new Subscription(); 
  puntos: number = 0;
  aciertos: number = 0;
  errores: number = 0;
  REQUERIMIENTOS_DRAGULA = 'ITEMS_JUEGO';
  // public many = ['The', 'possibilities', 'are', 'endless!'];
  // public many2 = ['Explore', 'them'];
  pedirCodigo : boolean = true;
  mostrarRetoAlimentacion : boolean = false;
  mostrarFinilazion: boolean = false;
  mostrarInicioModal: boolean = false;
  retroalimentacion : string = "";
  event: Event | undefined;
  valorCodigo : string = "";

  tipoJuego: string = "";
  ambiguosAndFuncionales: string = "";
  noAmbiguosAndNoFuncionales: string = "";
  requerimientoFinal: string = "";
  tipoJuegoID: number = 0;

  id_juegoTemp : number = 0;
  //juegosPublicos: any[] = [];

  requesitosAmbiguos : any[] = []

  requesitosNoAmbiguos : any[] = []

  requisitosNoFuncionales  : any[] = [];

  displayedColumns: string[] = ['position', 'id_juego', 'fecha_creacion', 'fecha_finalizacion', "acctions"];

  horaActual: string = new Date().toTimeString().split(' ')[0];

  public constructor(private dragulaService:DragulaService,private _translateService: TranslateService, private _alumnoService : AlumnoService, private _snackBar: MatSnackBar) {
    this.subs.add(dragulaService.dropModel(this.REQUERIMIENTOS_DRAGULA)
      .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
        const itemId = target!.id;
        const puntosActual = this.puntos;
        if(itemId != 'requerimientos_no_funcionales') {
          if(item.ambiguo){
            if(itemId == 'requerimientos_ambiguos'){
              item.requerimientoCompleto = 'si';
              this.puntos = (item.requrimientoFallido) ? puntosActual : puntosActual + item.puntos;
              if (!item.requrimientoFallido) {
                  this.aciertos = this.aciertos +1;
              }
            }
            else {
              item.requerimientoCompleto = 'error';
              item.requrimientoFallido = true;
              this.puntos = this.puntos - 100;
              this.retroalimentacion = item.retroAlimentacion;
              if (this.retroalimentacion != "")
                this.mostrarRetoAlimentacion = true;
              this.errores = this.errores +1;
            }
          }
          else {
            if(itemId == 'requerimientos_no_ambiguos'){
              item.requerimientoCompleto = 'si';
              this.puntos = (item.requrimientoFallido) ? puntosActual : puntosActual + item.puntos;
               if (!item.requrimientoFallido) {
                  this.aciertos = this.aciertos +1;
              }
            }
            else {
              item.requerimientoCompleto = 'error';
              item.requrimientoFallido = true;
              this.puntos = this.puntos - 100;
              this.retroalimentacion = item.retroAlimentacion;
              if (this.retroalimentacion != "")
                this.mostrarRetoAlimentacion = true;
              this.errores = this.errores +1;
            }
          }
        }
      })
    );
  
    this.dragulaService.drop(this.REQUERIMIENTOS_DRAGULA)
    .subscribe(({ name, el, target, source, sibling }) => {
      if(this.requisitosNoFuncionales.length == 0 && !this.requesitosAmbiguos.some(requisito => requisito.requerimientoCompleto != 'si') && !this.requesitosNoAmbiguos.some(requisito => requisito.requerimientoCompleto != 'si'))
        this.mostrarFinilazion = true;
    });

    dragulaService.createGroup(this.REQUERIMIENTOS_DRAGULA, {
      moves: (el, container, handle) => {
        return handle!.className.includes('handle bi bi-arrows-move cursor-move');
      },
    });
    
  }
  ngOnInit(): void {
  }

  buscarJuego() {
    const dataLocal = JSON.parse(localStorage.getItem('persona')!)
    const criteria = {
      id: this.valorCodigo,
      idusuario: dataLocal.id
    }
    this._alumnoService.recuperarJuego(criteria).subscribe((dataResponse) => {
      if(dataResponse.msg == 'OK') {
        if(dataResponse.result.estado == 1) {
          let tipoJuegoInicial = "";
          this.tipoJuegoID = dataResponse.result.id_tipo_juego;
          switch(dataResponse.result.id_tipo_juego) {
            case '1':
                this.tipoJuego = 'tipo-juego.juego-1-title';
                this.ambiguosAndFuncionales = 'user-hub-module.serios-game.ambiguos';
                this.noAmbiguosAndNoFuncionales = 'user-hub-module.serios-game.no-ambiguos';
                this.requerimientoFinal = 'user-hub-module.serios-game.req-no-funcionales';
                tipoJuegoInicial = "NFA"
                break;
            case '2':
              this.ambiguosAndFuncionales = 'user-hub-module.serios-game.funcionales';
              this.noAmbiguosAndNoFuncionales = 'user-hub-module.serios-game.no-funcionales';
              this.requerimientoFinal = 'user-hub-module.serios-game.req-funcionales-no-funcionales';
              this.tipoJuego = 'tipo-juego.juego-2-title';
              tipoJuegoInicial = "RF"
              break;
            case '3':
              this.ambiguosAndFuncionales = 'user-hub-module.serios-game.ambiguos';
              this.noAmbiguosAndNoFuncionales = 'user-hub-module.serios-game.no-ambiguos';
              this.requerimientoFinal = 'user-hub-module.serios-game.req-funcionales';
              tipoJuegoInicial = "FA"
              this.tipoJuego = 'tipo-juego.juego-3-title';
              break;
          };
          const jsonTemp = JSON.parse(dataResponse.result.json);
          this.requisitosNoFuncionales = jsonTemp[0].requerimientos.map((data: any) => {
            return {
              texto: data.requerimiento,
              retroAlimentacion: data.retroalimentacion,
              ambiguo: (data.opcionRequerimiento == tipoJuegoInicial) ? true : false,
              requrimientoFallido: data.requerimientoFallido,
              requerimientoCompleto: "no",
              id: data.id,
              puntos: data.puntosAdicionales

            }
          });
          this.requisitosNoFuncionales = this.algoritmoShuffleArray(this.requisitosNoFuncionales);
          this.pedirCodigo = false;
          this.id_juegoTemp = Number(this.valorCodigo);
          this.mostrarInicioModal = true;
        }
        else {
          this.openSnackBar(this._translateService.instant('general-msg.esta-incorrecto'),'custom-snackbar_fallido');
        }
      }
      else {
        if(dataResponse.msg == 'not_game')
          this.openSnackBar(this._translateService.instant('general-msg.codigo-incorrecto'), 'custom-snackbar_fallido');
        else
          this.openSnackBar(this._translateService.instant('general-msg.estado_jugado'), 'custom-snackbar_fallido');
      }
      this.valorCodigo = "";
    })
    
  }

  algoritmoShuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    const group = this.dragulaService.find(this.REQUERIMIENTOS_DRAGULA);
    if (group) {
      this.dragulaService.destroy(this.REQUERIMIENTOS_DRAGULA);
    }
  }

  openSnackBar(message: string, class_customer: string) {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    config.panelClass = "ml-8"
    config.panelClass = [class_customer];
    this._snackBar.open(message,'',config);
  }

  enviarPuntajeJuego() {
    const dataLocal = JSON.parse(localStorage.getItem('persona')!);
    const criteria = {
      id_juego: this.id_juegoTemp,
      id_persona: dataLocal.id,
      puntaje: this.puntos,
      hora_inicio: this.horaActual,
      aciertos: this.aciertos,
      errores: this.errores,
      hora_fin: new Date().toTimeString().split(' ')[0]
    }
    this._alumnoService.guardarPuntaje(criteria).subscribe(dataResponse=>{
      if(dataResponse.msg == 'OK') {
        if(dataResponse.result == "usuario_jugado") {
          this.openSnackBar(this._translateService.instant('general-msg.error-guardar-juego'),'custom-snackbar_fallido');
        }
        if(dataResponse.result == "error_insert"){
          this.openSnackBar(this._translateService.instant('general-msg.error-guardar-juego-2'),'custom-snackbar_fallido');
        }
        if(dataResponse.result == "exito_insert") {
          this.openSnackBar(this._translateService.instant('general-msg.ok-guardar-juego'),'custom-snackbar_exitoso');
        }
        this.reiciarComponente();
        this.mostrarFinilazion = false;
      }
    })
  }

  reiciarComponente() {
    this.requesitosAmbiguos = []
    this.requesitosNoAmbiguos = []
    this.requisitosNoFuncionales  = [];
    this.valorCodigo = "";
    this.pedirCodigo = true;
    this.puntos = 0;
    this.id_juegoTemp = 0;
    this.aciertos = 0;
    this.errores = 0;
  }

}
