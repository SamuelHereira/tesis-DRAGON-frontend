import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './View/Pages/home/home.component';
import { SeriosGameComponent } from './View/Pages/serios-game/serios-game.component';
import { PerfilComponent } from './View/Pages/perfil/perfil.component';
import { CreateGameComponent } from './View/Pages/create-game/create-game.component';
import { JuegosCreadosComponent } from './View/Pages/juegos-creados/juegos-creados.component';
import { ReportesComponent } from './View/Pages/reportes/reportes.component';
import { JuegosJugadosComponent } from './View/Pages/juegos-jugados/juegos-jugados.component';
import { RevisoresJuegoComponent } from './View/Pages/revisores-juego/revisores-juego.component';
import { RevisorJuegosAsignadosComponent } from './View/Pages/revisor-juegos-asignados/revisor-juegos-asignados.component';
import { RevisarJuegoComponent } from './View/Pages/revisar-juego/revisar-juego.component';
import { ProfesorRevisorJuegosAsignadosComponent } from './View/Pages/profesor-revisor-juegos-asignados/profesor-revisor-juegos-asignados.component';
import { ProfesorRevisarJuegoComponent } from './View/Pages/profesor-revisar-juego/profesor-revisar-juego.component';
import { ProfesorRevisarRevisionComponent } from './View/Pages/profesor-revisar-revision/profesor-revisar-revision.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'serious-game', component: SeriosGameComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'crear-juego', component: CreateGameComponent },
      { path: 'juegos-creados', component: JuegosCreadosComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: 'juegos-jugados', component: JuegosJugadosComponent },
      {
        path: 'juegos-creados/:id/revisores',
        component: RevisoresJuegoComponent,
      },
      {
        path: 'revisor',
        component: RevisorJuegosAsignadosComponent,
      },
      {
        path: 'revisor/:id/revisar-juego',
        component: RevisarJuegoComponent,
      },
      {
        path: 'profesor-revisor',
        component: ProfesorRevisorJuegosAsignadosComponent,
      },
      {
        path: 'profesor-revisor/:id/revisiones',
        component: ProfesorRevisarJuegoComponent,
      },
      {
        path: 'profesor-revisor/:id/revisiones/:position',
        component: ProfesorRevisarRevisionComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingUserHubModule {}
