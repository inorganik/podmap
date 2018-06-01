import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PodmapComponent } from './podmap/podmap.component';
import { AdminComponent } from './podmap/admin/admin.component';
import { LoginComponent } from './podmap/login/login.component';
import { SearchComponent } from './podmap/search/search.component';


const routes: Routes = [
  {
    path: '',
    component: PodmapComponent,
    children: [
      {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
      },
      {
        path: 'search',
        component: SearchComponent
      },
      {
        path: 'admin',
        component: AdminComponent
      },
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
