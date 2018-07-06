import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// angularfire
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
// custom
import { MapModule } from './map/map.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'Podmap'),
    MapModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
