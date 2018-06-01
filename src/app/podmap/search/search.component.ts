import { Component, ApplicationRef } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { Podcast, PodcastLocation, SuggestionStatus, PodcastSuggestion } from '../models';
// angularfire
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Place, Position } from '../models';
import { MapService } from '../map.service';

declare const navigator;
declare let google: any;


@Component({
  selector: 'pm-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent {

  loading = false;
  podcast: PodcastSuggestion;
  place: Place;
  podcastSubjectState: any;
  // firestore
  suggestionCollection: AngularFirestoreCollection<PodcastSuggestion>;

  constructor(
    private mapService: MapService,
    private applicationRef: ApplicationRef,
    private afs: AngularFirestore
  ) {
    // firestore
    this.suggestionCollection = afs.collection('suggestions');
    // misc
    this.resetSubjectState();
  }

  resetSubjectState() {
    this.podcastSubjectState = {
      hasLocation: false,
      submitted: false
    };
  }

  // podcast chosen from typeahead
  setPodcast(podcast: Podcast) {
    if (podcast) {
      // TODO: lookup podcast, check for location
      this.resetSubjectState(); // temp, assume not in db
      this.podcast = {
        collectionId: podcast.collectionId,
        collectionName: podcast.collectionName,
        artistName: podcast.artistName,
        artworkUrl60: podcast.artworkUrl60,
        artworkUrl100: podcast.artworkUrl100
      };
    }
    else {
      this.podcast = null;
      this.resetSubjectState();
    }
  }

  // place chosen from typeahead
  setPlace(place: Place) {
    this.place = place;
    if (this.mapService.placesService) {
      this.loading = true;
      this.mapService.placesService.getDetails({
        placeId: this.place.place_id
      }, (placeDetails, status) => {
        this.loading = false;
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // console.log('place details', placeDetails);
          const position: Position = {
            lat: placeDetails.geometry.location.lat(),
            lng: placeDetails.geometry.location.lng()
          };
          this.mapService.updatePosition(position);
          this.mapService.zoomToCity();
          this.place.position = position;
          this.applicationRef.tick();
        }
        else {
          console.error(status);
        }
      });
    }
  }

  submitLocation() {
    // do stuff
    const geoPoint = new firebase.firestore.GeoPoint(this.place.position.lat, this.place.position.lng);
    this.podcast.locationName = this.place.description;
    this.podcast.geoPoint = geoPoint;
    this.podcast.placeId = this.place.place_id;
    this.podcast.status = 0;
    console.log('submit suggestion', this.podcast);
    // this.suggestionCollection.add(thid.podcast);
    this.podcastSubjectState.submitted = true;

    // const placeDoc = this.afs.doc<PodcastLocation>(`locations/${this.place.placeId}`);
    // const podcasts = placeDoc.collection<Podcast>('podcasts').add

  }

  clearPodcast() {
    this.resetSubjectState();
    this.podcast = null;
  }

}
