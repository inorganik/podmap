import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Podcast } from '../../models';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class PodcastResolver implements Resolve<Podcast> {

  constructor(private afs: AngularFirestore) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.afs.doc<Podcast>(`podcasts/${route.params.collectionId}`).valueChanges();
  }
}
