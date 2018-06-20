import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { PodcastSuggestion, SuggestionStatus } from '../map/models';
import { Observable } from 'rxjs';
import { MapService } from '../services/map.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'pm-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  suggestions$: Observable<PodcastSuggestion[]>;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore,
    private mapService: MapService
  ) {
    // get unmoderated suggestions
    this.suggestions$ = afs.collection<PodcastSuggestion>('suggestions', ref => {
      return ref.where('status', '==', SuggestionStatus.Unmoderated);
    }).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as PodcastSuggestion;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  approve(suggestion: PodcastSuggestion) {
    // add podcast
    this.afs.doc(`podcasts/${suggestion.podcast.collectionId}`).set(suggestion.podcast);
    // increment podcount for each location
    const locPromises = [];
    suggestion.podcast.locations.forEach(location => {
      locPromises.push(
        this.mapService.getLocation(location)
          .then(loc => {
            loc.podCount = loc.podCount + 1;
            this.mapService.addOrUpdateLocation(loc)
              .then()
              .catch(err => console.error('Add location error', err));
          })
          .catch(err => console.error('Get location error', err)));
    });
    Promise.all(locPromises)
      .then(() => {
        suggestion.status = SuggestionStatus.Approved;
        this.afs.doc(`suggestions/${suggestion.id}`).set(suggestion);
      })
      .catch(err => console.error('error in .all', err));
  }

  reject(suggestion: PodcastSuggestion) {
    suggestion.status = SuggestionStatus.Rejected;
    this.afs.doc(`suggestions/${suggestion.id}`).set(suggestion);
  }

  signOut() {
    console.log('bye');
    this.afAuth.auth.signOut();
    this.router.navigateByUrl('/search');
  }

}
