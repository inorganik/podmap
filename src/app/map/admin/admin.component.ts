import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { PodcastSuggestion, SuggestionStatus } from '../models';
import { Observable } from 'rxjs';
import { MapService } from '../../services/map.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'pm-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  suggestions: Observable<PodcastSuggestion[]>;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore,
    private mapService: MapService
  ) {
    // get unmoderated suggestions
    this.suggestions = afs.collection<PodcastSuggestion>('suggestions', ref => {
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
    console.log('approve', suggestion);
    // add podcast
    this.afs.doc(`podcasts/${suggestion.podcast.collectionId}`).set(suggestion.podcast);
    // increment podcount for each location
    const locUpdates: Promise<any>[] = [];
    suggestion.podcast.locations.forEach(location => {
      locUpdates.push(
        this.mapService.getLocation(location)
          .then(loc => {
            loc.podCount++;
            this.mapService.addOrUpdateLocation(loc)
              .then(() => console.log(location.description + ' updated'));
          })
        );
    });
    Promise.all(locUpdates).then(() => {
      console.log('all locations updated');
      suggestion.status = SuggestionStatus.Approved;
      this.afs.doc(`suggestions/${suggestion.id}`).set(suggestion);
    });
    // todo test
  }

  reject(suggestion: PodcastSuggestion) {
    console.log('reject', suggestion);
    suggestion.status = SuggestionStatus.Rejected;
    this.afs.doc(`suggestions/${suggestion.id}`).set(suggestion);
  }

  signOut() {
    console.log('bye');
    this.afAuth.auth.signOut();
    this.router.navigateByUrl('/search');
  }

}
