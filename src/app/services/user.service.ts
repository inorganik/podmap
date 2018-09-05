import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser;

  // UIDs of whitelisted admins
  whitelisted = [
    'tA7f1eUMl2hSlsQIqsptJlqUBTW2',
    'dE4wVrL3excYGvw25JAlfelgU3K3',
    'PNHnkNc2gvW57D1rBSEhcVpJA7D3'
  ];

  constructor(public afAuth: AngularFireAuth, private router: Router) { }

  isLoggedIn(withRedirect?: boolean): Observable<boolean> {
    return this.afAuth.authState.pipe(
      first(),
      map(user => {
        this.currentUser = user;
        return !!user;
      }),
      tap(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigateByUrl('/admin/login');
        }
        else {
          if (!this.whitelisted.includes(this.currentUser.uid) && withRedirect) {
            this.router.navigateByUrl('/admin/forbidden');
          }
        }
      })
    );
  }

  isAdmin(): Observable<boolean> {
    return this.isLoggedIn(false).pipe(
      map(isLoggedIn => (isLoggedIn && this.whitelisted.includes(this.currentUser.uid)))
    );
  }
}
