import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UnmoderatedComponent } from './unmoderated/unmoderated.component';
import { LoginComponent } from './login/login.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AdminGuard } from '../guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'unmoderated'
      },
      {
        path: 'unmoderated',
        component: UnmoderatedComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'forbidden',
        component: ForbiddenComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
