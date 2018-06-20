import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
// google maps
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
// custom
import { MapComponent } from './map.component';
import { PodcastSearchComponent } from './search/podcast-search/podcast-search.component';
import { PlaceSearchComponent } from './search/place-search/place-search.component';
import { SearchComponent } from './search/search.component';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { AdComponent } from './ad/ad.component';
import { PodcastComponent } from './search/podcast/podcast.component';
import { LocationComponent } from './search/location/location.component';
import { PodcastListComponent } from './podcast-list/podcast-list.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HttpClientJsonpModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
      libraries: ['places'],
    }),
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
  declarations: [
    MapComponent,
    PodcastSearchComponent,
    PlaceSearchComponent,
    SearchComponent,
    LoginComponent,
    FooterComponent,
    AboutComponent,
    AdComponent,
    PodcastComponent,
    LocationComponent,
    PodcastListComponent
  ],
  exports: [
    MapComponent
  ],
  providers: [
    GoogleMapsAPIWrapper,
    AngularFirestore,
    AngularFireAuth
  ]
})
export class MapModule { }
