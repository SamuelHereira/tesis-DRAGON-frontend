import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import * as CryptoJS from 'crypto-js';
import { SecretKey } from 'src/app/Utils/const';
import { AuthService } from '../../../Service/auth.service';
import * as bcrypt from 'bcryptjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']

})
export class LoginComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar, private _translateService: TranslateService, private _serviceAuth : AuthService, private _roter: Router) { }

  iniciarSesion : boolean = true;
  ocultarPaaswordCrearCuenta : boolean = true;
  ocultarPaaswordLogin : boolean = true;
  secretKey = SecretKey.secret;

  loginFormGroup = new FormGroup({
    usuario: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
    password: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
    // nombre_responsable_editar: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
    // numero_responsable_editar: new FormControl('', { validators: [Validators.required, Validators.minLength(8), Validators.maxLength(8)], updateOn: 'blur' })
  });

  crearCuentaFormGroup = new FormGroup({
    usuario: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
    correo: new FormControl('', { validators: [Validators.required, Validators.email], updateOn: 'blur' }),
    password: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
    confirmarPassword: new FormControl('', { validators: Validators.required, updateOn: 'blur' }),
  });

  validador = {
    caracteres: false,
    general: false,
    repetido: false
  }

  ngOnInit() {}

  login() {
    const criteria = {
      usuario: String(this.loginFormGroup.value.usuario),
      password: String(this.loginFormGroup.value.password)
    }

    this._serviceAuth.login(criteria).subscribe(data=>{
      if(data.msg != 'OK') {
        let texto_retorno = "";
        switch(data.msg) {
          case 'usuario_incorrecto':
            texto_retorno = 'aut-module.input.usuario-incorrecto';
            break;
          case 'password_incorrecto':
            texto_retorno = 'aut-module.input.password-incorrecto';
            break;
          default:
            texto_retorno = 'aut-module.input.login-fallido';
        }
        this.openSnackBar(this._translateService.instant(texto_retorno),'custom-snackbar_fallido');
      }
      else {
        const dataResponse = {
          id: data.result.idUsuario,
          user: data.result.usuario
        }
        localStorage.setItem('persona', JSON.stringify(dataResponse));
        if(data.result.migrado == 'NOT') {
          this._roter.navigateByUrl("/auth/completar-perfil");
        }

        else {
          this.openSnackBar(this._translateService.instant('aut-module.input.login-exitoso'),'custom-snackbar_exitoso');
          this._roter.navigateByUrl("/home");
        }        
      }
    })
  }

  mensaje = "";

  crearCuenta() {
    const passwordTmp = this.crearCuentaFormGroup.value.password!;
    const passwordTmp2 = this.crearCuentaFormGroup.value.confirmarPassword!;
    if(passwordTmp.length <= 8) {
      //this.validador.caracteres = true;
      this.mensaje = "aut-module.validador.caracteres";
    }
    else {
      const regex = /^(?=.*[A-Z])(?=.*[\W_]).+$/;
      if (!regex.test(passwordTmp)) {
        this.mensaje = "aut-module.validador.general";
      } 
      else {
        if (passwordTmp == passwordTmp2) {
          this.mensaje = "";
          const criteria = {
            usuario: String(this.crearCuentaFormGroup.value.usuario),
            password: String(this.crearCuentaFormGroup.value.password),
            correo: String(this.crearCuentaFormGroup.value.correo),
          }

          this._serviceAuth.crearCuenta(criteria).subscribe((data)=>{
            if(data.msg == 'OK') {
              this.openSnackBar(this._translateService.instant('aut-module.input.crear-exitoso'),'custom-snackbar_exitoso');
              this.crearCuentaFormGroup.reset();
              this.loginFormGroup.reset();
              this.iniciarSesion = true;
            }
            else {
              if (data.msg == 'user_ocupado') {
                this.openSnackBar(this._translateService.instant('general-msg.usuario-ocupado'),'custom-snackbar_fallido');
              }
              else
                this.openSnackBar(this._translateService.instant('aut-module.input.crear-fallido'),'custom-snackbar_fallido');
            }
          });
        }
        else {
          this.mensaje = "aut-module.validador.repetido";
        }
      }
    }
    
  }

  dirigirRecuperarCuenta() {
    this._roter.navigateByUrl("/auth/recuperar-cuenta")
  }
  // onInputChange(): void {
  //   debugger;
  //   const passwordTmp = this.crearCuentaFormGroup.value.password!;
  //   const passwordTmp2 = this.crearCuentaFormGroup.value.confirmarPassword!;
  //   if(passwordTmp.length <= 8) {
  //     //this.validador.caracteres = true;
  //     this.mensaje = "aut-module.validador.caracteres";
  //   }
  //   else {
  //     const regex = /^(?=.*[A-Z])(?=.*[\W_]).+$/;
  //     if (!regex.test(passwordTmp)) {
  //       this.mensaje = "aut-module.validador.general";
  //     } 
  //     else {
  //         this.mensaje = "";
  //     }
  //     //this.validador.caracteres = false;
  //   }
  // }

  openSnackBar(message: string, class_customer: string) {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    config.panelClass = [class_customer];
    this._snackBar.open(message,'',config);
  }

}
