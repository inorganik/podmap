import { Component } from '@angular/core';
import * as firebase from 'firebase/app';
import { Podcast, PodcastLocation, PodcastSuggestion, SuggestionStatus } from '../models';
// angularfire
import { AngularFirestore } from 'angularfire2/firestore';
import { Place } from '../models';
import { MapService } from '../map.service';

declare const navigator;
declare let google: any;


@Component({
  selector: 'pm-search',
  templateUrl: './search.component.html'
})

export class SearchComponent {

  loading = false;
  podcast: Podcast;
  place: Place;
  submitted: Boolean = false;

  constructor(
    private mapService: MapService,
    private afs: AngularFirestore
  ) {}

  // podcast chosen from typeahead
  setPodcast(podcast: Podcast) {
    this.submitted = false;
    if (podcast) {
      // TODO: lookup podcast, check for location
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
          const geoPoint = new firebase.firestore.GeoPoint(placeDetails.geometry.location.lat(), placeDetails.geometry.location.lng());

          this.mapService.updatePosition(geoPoint);
          this.mapService.zoomToCity();
          this.place.geoPoint = geoPoint;
        }
        else {
          console.error(status);
        }
      });
    }
    else {
      console.error('No place service');
    }
  }

  submitLocationSuggestion() {
    const podLocation: PodcastLocation = {
      name: this.place.description,
      geoPoint: this.place.geoPoint,
      placeId: this.place.place_id
    };
    // use this for adding location in admin component
    // this.afs.doc(`locations/${podLocation.placeId}`).set(podLocation);

    const podSugg: PodcastSuggestion = {
      podcast: this.podcast,
      locations: [podLocation],
      status: SuggestionStatus.Unmoderated
    };

    this.afs.collection('suggestions').add(podSugg).then(() => {
      this.submitted = true;
    }, err => console.error('Error connecting to firebase', err));

  }

  clearPodcast() {
    this.submitted = false;
    this.podcast = null;
  }

}
