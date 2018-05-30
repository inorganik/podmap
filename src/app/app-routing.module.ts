import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PodmapComponent } from './podmap/podmap.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {
    path: '',
    component: PodmapComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
