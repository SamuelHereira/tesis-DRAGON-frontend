import { NgModule } from '@angular/core';
import { Shared_moduleModule } from 'src/app/Shared/shared_module.module';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppRoutingUserHubModule } from './userHub-routing.module';
import { HomeComponent } from './View/Pages/home/home.component';
import { SeriosGameComponent } from './View/Pages/serios-game/serios-game.component';
import { PerfilComponent } from './View/Pages/perfil/perfil.component';
import { DragulaModule } from 'ng2-dragula';
import { CreateGameComponent } from './View/Pages/create-game/create-game.component';
import { FormAgregarNivelComponent } from './View/components/form-agregar-nivel/form-agregar-nivel.component';
import { JuegosCreadosComponent } from './View/Pages/juegos-creados/juegos-creados.component';
import { ReportesComponent } from './View/Pages/reportes/reportes.component';
import { JuegosVaciosComponent } from './View/components/juegos-vacios/juegos-vacios.component';
import { JuegosJugadosComponent } from './View/Pages/juegos-jugados/juegos-jugados.component';

@NgModule({
  imports: [
    CommonModule,
    Shared_moduleModule,
    TranslateModule,
    AppRoutingUserHubModule,
    //DragulaModule.forRoot()
  ],
  declarations: [
    HomeComponent,
    SeriosGameComponent,
    PerfilComponent,
    CreateGameComponent,
    FormAgregarNivelComponent,
    JuegosCreadosComponent,
    ReportesComponent,
    JuegosVaciosComponent,
    JuegosJugadosComponent
  ]
})
export class UserHubModule { }
