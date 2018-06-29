import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { first, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  currentUser;

  // UIDs of whitelisted admins
  whitelisted = [
    'tA7f1eUMl2hSlsQIqsptJlqUBTW2',
    'dE4wVrL3excYGvw25JAlfelgU3K3',
    'PNHnkNc2gvW57D1rBSEhcVpJA7D3'
  ];

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
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
          if (!this.whitelisted.includes(this.currentUser.uid)) {
            this.router.navigateByUrl('/admin/forbidden');
          }
        }
      })
    );
  }
}
