import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../Service/auth.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-migracion',
  templateUrl: './migracion.component.html',
  styleUrls: ['./migracion.component.scss']
})
export class MigracionComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar, private _translateService: TranslateService,private _serviceAuth : AuthService, private _router : Router) { }

 
  datosCliente = {
    nombre: "",
    apellido: "",
    fechaNacimiento: new Date(),
    opcionRol: "e"
  }
  nombre: string = "aa";

  opcion: any[] = [
    { value: "e", label: "aut-module.migracion.estudiante"},
    { value: "p", label: "aut-module.migracion.profesor"}
  ]

  
  ngOnInit() {
  }

  migrarUsuario() {
    const dataLocal = JSON.parse(localStorage.getItem('persona')!);
    if (dataLocal == null) {
      localStorage.clear();
      this.openSnackBar(this._translateService.instant('USUARIO NO ENCONTRADO'),'custom-snackbar_fallido');
      this._router.navigateByUrl("/auth");
    }
    else {
      const criteria = {
        nombre: this.datosCliente.nombre,
        apellido: this.datosCliente.apellido,
        rol: this.datosCliente.opcionRol,
        fechaNacimiento: this.datosCliente.fechaNacimiento,
        id: dataLocal.id,
        usuario: dataLocal.user
      }
      
      this._serviceAuth.migracion(criteria).subscribe(data=>{
        if(data.msg == 'OK') {
          this.openSnackBar(this._translateService.instant('aut-module.input.login-exitoso'),'custom-snackbar_exitoso');
          this._router.navigateByUrl("/home");
        }
        else {
          this.openSnackBar(this._translateService.instant('USUARIO NO ENCONTRADO'),'custom-snackbar_fallido');
          localStorage.clear();
          this._router.navigateByUrl("/auth");
        }
      })
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
