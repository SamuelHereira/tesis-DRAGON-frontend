import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfesorService } from 'src/app/Modules/UserHubModule/Service/profesor.service';

@Component({
  selector: 'app-revisores-juego',
  templateUrl: './revisores-juego.component.html',
})
export class RevisoresJuegoComponent implements OnInit {
  idJuego!: number;
  revisores: any[] = [
    {
      id: 1,
      nombre: 'Revisor 1',
    },
    {
      id: 2,
      nombre: 'Revisor 2',
    },
    {
      id: 3,
      nombre: 'Revisor 3',
    },
    {
      id: 4,
      nombre: 'Revisor 4',
    },
  ];
  displayedColumns: string[] = ['id', 'nombre', 'actions'];

  asignarRevisor: boolean = false;
  revisorSeleccionado: string = '';

  constructor(
    private route: ActivatedRoute,
    private profesorService: ProfesorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.idJuego = +this.route.snapshot.paramMap.get('id')!;
    this.obtenerRevisores();
  }

  obtenerRevisores() {
    // this.profesorService.getRevisores().subscribe((res) => {
    //   this.revisores = res.result;
    // });
  }

  openModalAsignar() {
    this.asignarRevisor = true;
    this.cdr.detectChanges();
  }

  closeModalAsignar() {
    this.asignarRevisor = false;
    this.revisorSeleccionado = '';
  }

  asignar() {
    const payload = {
      id_juego: this.idJuego,
      id_revisor: this.revisorSeleccionado,
    };

    // this.profesorService.asignarRevisor(payload).subscribe((res) => {
    //   alert('Revisor asignado correctamente');
    // });
  }

  eliminarRevisor(id: number) {
    // this.profesorService.eliminarRevisor(id).subscribe((res) => {
    //   alert('Revisor eliminado correctamente');
    // });
  }
}
