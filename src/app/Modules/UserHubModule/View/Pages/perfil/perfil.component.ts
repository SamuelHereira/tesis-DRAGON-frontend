import { Component, OnInit } from '@angular/core';
import { isEqual } from 'lodash';
import { HomeService } from '../../../Service/home.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  
  constructor(private _homeService: HomeService, private _snackBar: MatSnackBar, private _translateService: TranslateService,) { }

  desabilitarNombre: boolean =  true;

  viewConfirmacionEditar: boolean = false;

  usuarioInformacion: any = {}

  usuarioInformacion_copy: any = {}

  password_antiguo : string = "";

  ngOnInit() {
    this.obtenerDatosPerfil();
  }

  obtenerDatosPerfil() {
    const dataLocal = JSON.parse(localStorage.getItem('persona')!);
    const criteria = {
      "idUsuario": dataLocal.id,
      "usuario": dataLocal.user
    }
    this._homeService.obtenerDatosPerfil(criteria).subscribe(dataResponse=>{
      if(dataResponse.msg == 'OK') {
        this.usuarioInformacion = {
          usuario: dataResponse.result.usuario,
          nombres: dataResponse.result.nombres,
          apellidos: dataResponse.result.apellidos,
          correo: dataResponse.result.correo,
          rol: (dataResponse.result.rol == 'p') ? this._translateService.instant('general.profesor') : this._translateService.instant('general.estudiante'),
          edad: this.calcularEdad(new Date(dataResponse.result.fechaNacimiento)),
          fechaNacimiento: new Date(dataResponse.result.fechaNacimiento),
          password: "",
        };
        this.usuarioInformacion_copy = {...this.usuarioInformacion};
      }
      else {
        this.openSnackBar(this._translateService.instant('general-msg.error-get-user'),'custom-snackbar_fallido');
      }
    })
  }

  habilitarNombre() {
    this.desabilitarNombre = false;
  }

  validarObjetosIguales(): boolean {
      return isEqual(this.usuarioInformacion_copy, this.usuarioInformacion);
  }

  cancelarActualizacion() {
    this.usuarioInformacion = {...this.usuarioInformacion_copy};
    this.desabilitarNombre = true;
  }

  calcularEdad(fechaNacimiento: Date): number {
    const hoy = new Date();
    const fechaCumple = new Date(fechaNacimiento);
    
    let edad = hoy.getFullYear() - fechaCumple.getFullYear();
    const mesActual = hoy.getMonth();
    const mesCumple = fechaCumple.getMonth();

    if (mesActual < mesCumple || (mesActual === mesCumple && hoy.getDate() < fechaCumple.getDate())) {
      edad--;
    }

    return edad;
  }

  abrirModalConfirmacion(){
    this.viewConfirmacionEditar = true;
  }

  cerrarModalConfirmacion(){
    this.viewConfirmacionEditar = false;
    this.password_antiguo = ""
  }

  editarPerfil() {
    const dataLocal = JSON.parse(localStorage.getItem('persona')!);
    const criteria = {
      id_persona: dataLocal.id, 
      password: this.password_antiguo,
      nombres: this.usuarioInformacion.nombres, 
      apellidos: this.usuarioInformacion.apellidos, 
      fechaN: this.usuarioInformacion.fechaNacimiento, 
      new_password: this.usuarioInformacion.password
    }
    this._homeService.editarPerfil(criteria).subscribe(dataResponse=> {
      if(dataResponse.msg == 'OK') {
        switch(dataResponse.result) {
          case 'error_insert':
            this.openSnackBar(this._translateService.instant('general-msg.error-put-user'),'custom-snackbar_fallido');
            this.password_antiguo = "";
            break;
          case 'PASSWORD_FAILD':
            this.openSnackBar(this._translateService.instant('general-msg.error-put-user-password'),'custom-snackbar_fallido');
            this.password_antiguo = "";
            break;
          case 'exito_insert':
            this.openSnackBar(this._translateService.instant('general-msg.sucess-put-user'),'custom-snackbar_exitoso');
            this.usuarioInformacion.password = "";
            this.cerrarModalConfirmacion();
            break;
        }
      }
      else {
        this.openSnackBar(this._translateService.instant('general-msg.error-put-user'),'custom-snackbar_fallido');
      }
    })
  }

  verificarPassword(): boolean {
    
    if(this.usuarioInformacion.password == "" ||  this.password_antiguo == "")
        return false;
    else{
      return (this.usuarioInformacion.password == this.password_antiguo) ? true : false;
    }
  }

  openSnackBar(message: string, class_customer: string) {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    config.panelClass = [class_customer];
    this._snackBar.open(message,'',config);
  }

  changeFecha(){
    this.usuarioInformacion.edad = this.calcularEdad(new Date(this.usuarioInformacion.fechaNacimiento));
  }

}
