import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { PodcastSuggestion, SuggestionStatus, PodcastLocation } from '../../map/models';
import { Observable } from 'rxjs';
import { MapService } from '../../services/map.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'pm-unmoderated',
  templateUrl: './unmoderated.component.html',
  styleUrls: ['./unmoderated.component.scss']
})
export class UnmoderatedComponent {

  suggestions$: Observable<PodcastSuggestion[]>;

  constructor(
    private afs: AngularFirestore,
    private mapService: MapService
  ) {
    // get unmoderated suggestions
    this.suggestions$ = afs.collection<PodcastSuggestion>('suggestions', ref =>
      ref.where('status', '==', SuggestionStatus.Unmoderated)
        .orderBy('podcast.collectionName')
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as PodcastSuggestion;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  approve(suggestion: PodcastSuggestion) {
    // add podcast
    this.mapService.safelyAddPodcast(suggestion.podcast)
      .then(() => {
        this.mapService.incrementPodcastCount();
        // increment podcount for each location
        const locPromises = [];
        suggestion.podcast.locations.forEach(location =>
          locPromises.push(
            this.mapService.getAndIncrementPodCountForLocation(location)
          )
        );
        Promise.all(locPromises)
          .then(() => {
            this.mapService.persistMarkers()
              .catch(err => console.error('persistMarkers():', err));
            suggestion.status = SuggestionStatus.Approved;
            this.afs.doc(`suggestions/${suggestion.id}`).set(suggestion);
          })
          .catch(err => console.error('getAndIncrementPodCountForLocation():', err));
      })
      .catch(() => alert('Podcast already added. Please reject this suggestion.'));
  }

  reject(suggestion: PodcastSuggestion) {
    suggestion.status = SuggestionStatus.Rejected;
    this.afs.doc(`suggestions/${suggestion.id}`).set(suggestion);
  }

  encodeUrl(feedUrl: string): string {
    return encodeURIComponent(feedUrl);
  }

}
