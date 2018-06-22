import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { MaterialModule } from '../material/material.module';
import { AdminRoutingModule } from './admin-routing.module';
// angularfire
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AppModule } from '../app.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    AppModule,
    SharedModule
  ],
  declarations: [
    AdminComponent
  ],
  providers: [
    AngularFirestore,
    AngularFireAuth
  ]
})
export class AdminModule { }
