import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapComponent } from './map/map.component';
import { SearchComponent } from './map/search/search.component';
import { AboutComponent } from './map/about/about.component';
import { PodcastComponent } from './map/search/podcast/podcast.component';
import { LocationComponent } from './map/search/location/location.component';
import { NotFoundComponent } from './not-found/not-found.component';


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
        loadChildren: 'src/app/+admin/admin.module#AdminModule'
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
