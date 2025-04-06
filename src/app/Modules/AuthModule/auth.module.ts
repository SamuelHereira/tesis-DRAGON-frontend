import { NgModule } from '@angular/core';
import { LoginComponent } from './View/Pages/login/login.component';
import { AppRoutingAuthModule } from './auth-routing.module';
import { Shared_moduleModule } from 'src/app/Shared/shared_module.module';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MigracionComponent } from './View/Pages/migracion/migracion.component';
import { AuthModuloComponent } from './auth-module.component';
import { RecuperacionPasswordComponent } from './View/Pages/recuperacion-password/recuperacion-password.component';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingAuthModule,
    Shared_moduleModule,
    TranslateModule
  ],
  declarations: [
    LoginComponent,
    MigracionComponent,
    AuthModuloComponent,
    RecuperacionPasswordComponent
  ]
})
export class AuthModule { }
