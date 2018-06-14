import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { first, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // UIDs of whitelisted admins
  whitelisted = [
    'tA7f1eUMl2hSlsQIqsptJlqUBTW2'
  ];

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.afAuth.authState.pipe(
      first(),
      map(user => user && this.whitelisted.includes(user.uid)),
      tap(isAdmin => {
        if (!isAdmin) {
          this.router.navigateByUrl('/login');
        }
      })
    );
  }
}
