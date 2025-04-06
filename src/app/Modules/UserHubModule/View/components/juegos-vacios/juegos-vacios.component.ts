import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-juegos-vacios',
  templateUrl: './juegos-vacios.component.html',
  styleUrls: ['./juegos-vacios.component.scss']
})
export class JuegosVaciosComponent implements OnInit {

  @Input() errprEstudiante: boolean = false;
  constructor(private _router: Router) { }

  ngOnInit() {
  }

  crearJuego() {
    if(this.errprEstudiante == false)
      this._router.navigateByUrl('/home/crear-juego');
    else
      this._router.navigateByUrl('/home/serious-game');
  }

}
