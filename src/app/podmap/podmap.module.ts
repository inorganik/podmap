import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
// google maps
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
// custom
import { PodmapComponent } from './podmap.component';
import { PodcastSearchComponent } from './search/podcast-search/podcast-search.component';
import { PlaceSearchComponent } from './search/place-search/place-search.component';
import { SearchComponent } from './search/search.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';

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
    FormsModule,
    RouterModule
  ],
  declarations: [
    PodmapComponent,
    PodcastSearchComponent,
    PlaceSearchComponent,
    SearchComponent,
    LoginComponent,
    AdminComponent,
    FooterComponent,
    AboutComponent
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
