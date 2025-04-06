import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../Service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperacion-password',
  templateUrl: './recuperacion-password.component.html',
  styleUrls: ['./recuperacion-password.component.scss']
})
export class RecuperacionPasswordComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar, private _translateService: TranslateService,private _serviceAuth : AuthService, private _router : Router) { }

  datosCargados = false;
  datosCliente = {
    correo: "",
    passwordTemp: "",
    password: "",
    confirmarPassword: ""
  }

  paso = 1;
  ocultarPaaswordCrearCuenta : boolean = true;
  ocultarPaaswordCrearCuenta1 : boolean = true;
  ocultarPaaswordCrearCuenta2: boolean = true;
  
   mensaje = "";
 


  
  ngOnInit() {
  }

  recuperarCuenta() {
    this.datosCargados = true;
    this._serviceAuth.recuperarCuenta({ correo: this.datosCliente.correo }).subscribe(data => {
      if (data.msg == 'OK') { 
        this.openSnackBar(this._translateService.instant('aut-module.recuperar-cuenta.ok'), 'custom-snackbar_exitoso');
        this.paso = 2;
      }
      else {
        if (data.msg == 'correo_not_bd') {
           this.openSnackBar(this._translateService.instant('aut-module.recuperar-cuenta.error4'),'custom-snackbar_fallido');
        }
        else {
           this.openSnackBar(this._translateService.instant('aut-module.recuperar-cuenta.error'),'custom-snackbar_fallido');
        }
      }
      this.datosCargados = false;
    })
  }

  regresar() {
    this._router.navigateByUrl("/auth")
  }

  cambiarPassword() {
    const passwordTmp = this.datosCliente.password!;
    const passwordTmp2 = this.datosCliente.confirmarPassword;
    if(passwordTmp.length <= 8) {
      this.mensaje = "aut-module.validador.caracteres";
    }
    else {
      const regex = /^(?=.*[A-Z])(?=.*[\W_]).+$/;
      if (!regex.test(passwordTmp)) {
        this.mensaje = "aut-module.validador.general";
      } 
      else {
        if (passwordTmp == passwordTmp2) {
           this.datosCargados = true;
          this.mensaje = "";
         const criteria = {
            correo: this.datosCliente.correo,
            password: this.datosCliente.password,
            password2: this.datosCliente.passwordTemp,
         }
          this._serviceAuth.cambiarPassword(criteria).subscribe(data => {
            if (data.msg == 'OK') { 
              this.openSnackBar(this._translateService.instant('aut-module.recuperar-cuenta.ok2'), 'custom-snackbar_exitoso');
              this._router.navigateByUrl("/auth")
            }
            else {
              this.openSnackBar(this._translateService.instant('aut-module.recuperar-cuenta.error2'),'custom-snackbar_fallido');
            }
             this.datosCargados = false;
          })
        }
        else {
          this.mensaje = "aut-module.validador.repetido";
        }
      }
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

}
