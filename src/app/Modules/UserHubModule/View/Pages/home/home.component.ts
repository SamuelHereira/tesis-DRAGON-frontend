import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import { NavigationEnd, Router, Event } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { HomeService } from 'src/app/Modules/UserHubModule/Service/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']

})
export class HomeComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar, private _translateService: TranslateService, private _router : Router, private _serviceHome : HomeService) { }

  iniciarSesion : boolean = true;
  ocultarPaaswordCrearCuenta : boolean = true;
  ocultarPaaswordLogin : boolean = true;
  viewMenu : boolean = true;
  viewMenu2 : boolean = false;

  usuarioRegistrado = {
    id: 0,
    usuario: "",
    ultimoRegistro: "",
    rol: ""
   }

  menu_lista : any [] = [];

  ngOnInit() {
    this._router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        //this.handleChildAction();
        let currentRoute = event.urlAfterRedirects; // Obtener la ruta actual
        this.menu_lista = this.menu_lista.map((menu)=>{
          menu.activo = menu.ruta == currentRoute;
          return menu
        })
      });
    this.obtenerRegistro();
  }

  obtenerRegistro() {
    const dataLocal = JSON.parse(localStorage.getItem('persona')!);
    const criteria = {
      "idUsuario": dataLocal.id,
      "usuario": dataLocal.user
    }
    this._serviceHome.recuperarRegistro(criteria).subscribe(dataResponse => {
      if(dataResponse.msg == 'OK') {
        this.usuarioRegistrado = {
          id : dataLocal.id,
          usuario : dataLocal.user,
          ultimoRegistro : dataResponse.result.registro,
          rol : dataResponse.result.rol
        }
        this.llenarOpcionesMenu(dataResponse.result.rol);
        if(dataResponse.result.rol == 'p') {
          this._router.navigateByUrl("/home/juegos-creados");
        }
        else {
          this._router.navigateByUrl("/home/serious-game");
        }
      }
      else {
        this.openSnackBar(this._translateService.instant('USUARIO NO ENCONTRADO'),'custom-snackbar_fallido');
        localStorage.clear();
        this._router.navigateByUrl("/auth");
      }
    })
  }

  llenarOpcionesMenu(rol : string){
    if(rol == 'p') {
      this.menu_lista = [
        {
          titulo: "user-hub-module.home.menu.juegos-creados",
          icono: "bi bi-person-arms-up",
          ruta: "/home/juegos-creados",
          activo: true,
          id: 1
        },
        {
          titulo: "user-hub-module.home.menu.perfil",
          icono: "bi bi-person-fill-gear",
          ruta: "/home/perfil",
          activo: false,
          id: 2
        },
        {
          titulo: "user-hub-module.home.menu.crear-juego",
          icono: "bi bi-joystick",
          ruta: "/home/crear-juego",
          activo: false,
          id: 3
        },
        {
          titulo: "user-hub-module.home.menu.reporte",
          icono: "bi bi-file-earmark-pdf-fill",
          ruta: "/home/reportes",
          activo: false,
          id: 4
        },
        {
          titulo: "user-hub-module.home.menu.salir",
          icono: "bi bi-arrow-left-square-fill",
          ruta: "/auth",
          activo: false,
          id: 5
        }
      ]
    }
    else {
      this.menu_lista = [
        {
          titulo: "user-hub-module.home.menu.inicio",
          icono: "bi bi-house-door-fill",
          ruta: "/home/serious-game",
          activo: true,
          id: 1
        },
        {
          titulo: "user-hub-module.home.menu.juegos-jugados",
          icono: "bi bi-joystick",
          ruta: "/home/juegos-jugados",
          activo: false,
          id: 2
        },
        {
          titulo: "user-hub-module.home.menu.perfil",
          icono: "bi bi-person-fill-gear",
          ruta: "/home/perfil",
          activo: false,
          id: 2
        },
        {
          titulo: "user-hub-module.home.menu.salir",
          icono: "bi bi-arrow-left-square-fill",
          ruta: "/auth",
          activo: false,
          id: 4
        }
      ]
    }
 }
  cambioMenu(id : number, ruta : string) {
    if(ruta == '/auth') {
      localStorage.clear();
    }
    this._router.navigateByUrl(ruta);
    this.viewMenu2 = false;
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
