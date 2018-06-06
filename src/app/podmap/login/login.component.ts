import { Component, NgZone } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';

@Component({
  selector: 'pm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private zone: NgZone
  ) { }

  signinWithGoogle() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(() => {
        this.zone.run(() => this.router.navigateByUrl('/admin'));
      }, err => console.error(err));
  }

}
