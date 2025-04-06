import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Page404Component } from './Shared/Common/page-404/page-404.component';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./Modules/AuthModule/auth.module').then(m => m.AuthModule)},
  { path: 'home', loadChildren: () => import('./Modules/UserHubModule/userHub.module').then(m => m.UserHubModule)},
  { path: '', redirectTo: 'auth', pathMatch: 'full'},
  { path: '**', component: Page404Component}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
