import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
// angularfire
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { SharedModule } from '../shared/shared.module';
import { UnmoderatedComponent } from './unmoderated/unmoderated.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ],
  declarations: [
    AdminComponent,
    LoginComponent,
    UnmoderatedComponent,
    ForbiddenComponent
  ],
  providers: [
    AngularFirestore,
    AngularFireAuth
  ]
})
export class AdminModule { }
