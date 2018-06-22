import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'pm-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent {

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router
  ) { }

  signOut() {
    console.log('bye');
    this.afAuth.auth.signOut();
    this.router.navigateByUrl('/');
  }

}
