import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PodmapComponent } from './podmap/podmap.component';
import { PodmapAdminComponent } from './podmap/admin/admin.component';

const routes: Routes = [
  {
    path: '',
    component: PodmapComponent
  },
  {
    path: 'admin',
    component: PodmapAdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
