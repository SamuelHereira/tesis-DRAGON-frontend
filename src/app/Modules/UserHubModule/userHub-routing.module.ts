import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './View/Pages/home/home.component';
import { SeriosGameComponent } from './View/Pages/serios-game/serios-game.component';
import { PerfilComponent } from './View/Pages/perfil/perfil.component';
import { CreateGameComponent } from './View/Pages/create-game/create-game.component';
import { JuegosCreadosComponent } from './View/Pages/juegos-creados/juegos-creados.component';
import { ReportesComponent } from './View/Pages/reportes/reportes.component';
import { JuegosJugadosComponent } from './View/Pages/juegos-jugados/juegos-jugados.component';

const routes: Routes = [
  { path: '', component: HomeComponent, 
    children:[
      {path: 'serious-game', component: SeriosGameComponent},
      {path: 'perfil', component: PerfilComponent},
      {path: 'crear-juego', component: CreateGameComponent},
      {path: 'juegos-creados', component: JuegosCreadosComponent},
      {path: 'reportes', component: ReportesComponent},
      {path: 'juegos-jugados', component: JuegosJugadosComponent},
    ] 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingUserHubModule {}
