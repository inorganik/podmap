import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// angularfire
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
// pages
import { PodmapModule } from './podmap/podmap.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'Superfeed'),
    PodmapModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
