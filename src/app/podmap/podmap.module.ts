import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
// google maps
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
// custom
import { PodmapComponent } from './podmap.component';
import { PodcastSearchComponent } from './podcast-search/podcast-search.component';
import { PlaceSearchComponent } from './place-search/place-search.component';
import { PodmapAdminComponent } from './admin/admin.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HttpClientJsonpModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
      libraries: ['places'],
      apiVersion: '3.exp'
    }),
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    PodmapComponent,
    PodcastSearchComponent,
    PlaceSearchComponent,
    PodmapAdminComponent
  ],
  exports: [
    PodmapComponent
  ],
  providers: [
    GoogleMapsAPIWrapper,
    AngularFirestore
  ]
})
export class PodmapModule { }
