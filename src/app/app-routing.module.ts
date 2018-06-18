import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapComponent } from './map/map.component';
import { AdminComponent } from './map/admin/admin.component';
import { LoginComponent } from './map/login/login.component';
import { SearchComponent } from './map/search/search.component';
import { AboutComponent } from './map/about/about.component';
import { AuthGuard } from './guards/auth.guard';
import { PodcastComponent } from './map/search/podcast/podcast.component';
import { LocationComponent } from './map/search/location/location.component';


const routes: Routes = [
  {
    path: '',
    component: MapComponent,
    children: [
      {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
      },
      {
        path: 'search',
        component: SearchComponent,
        children: [
          {
            path: 'podcast',
            redirectTo: ''
          },
          {
            path: 'podcast/:collectionId',
            component: PodcastComponent
          },
          {
            path: 'location',
            redirectTo: ''
          },
          {
            path: 'location/:placeId',
            component: LocationComponent
          }
        ]
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
