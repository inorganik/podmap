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
  places: Place[] = [];
  submitted = false;
  locationUnknown = false;
  searchLocation: string;
  fetchingLocation = false;
  podcastPlace = '';

  constructor(
    private mapService: MapService,
    private afs: AngularFirestore
  ) {
    this.resetSearchLocationString();
  }

  resetSearchLocationString() {
    this.searchLocation = 'Search my location »';
    this.fetchingLocation = false;
  }

  // podcast chosen from typeahead
  setPodcast(podcast: any) {
    // console.log('podcast', podcast);
    this.submitted = false;
    if (podcast) {
      // TODO: lookup podcast, check for location
      this.locationUnknown = true; // TEMP
      this.podcast = {
        collectionId: podcast.collectionId,
        collectionName: podcast.collectionName,
        artistName: podcast.artistName,
        artworkUrl60: podcast.artworkUrl60,
        artworkUrl100: podcast.artworkUrl100,
        feedUrl: podcast.feedUrl,
        itunesSub: podcast.trackViewUrl,
        placeIds: {}
      };
    }
    else {
      this.podcast = null;
    }
  }

  podcastHasPlaces(): Boolean {
    return this.podcast && Object.getOwnPropertyNames(this.podcast.placeIds).length > 0;
  }

  addPlaceIfUnique(place: Place): Boolean {
    this.places.forEach(plc => {
      if (plc.place_id === place.place_id) {
        return false;
      }
    });
    this.places.push(place);
    return true;
  }

  // place chosen from typeahead
  setPlace(place: Place, addToPodcast: Boolean) {

    if (this.mapService.placesService) {
      this.loading = true;
      this.mapService.placesService.getDetails({
        placeId: place.place_id
      }, (placeDetails, status) => {
        this.loading = false;
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const geoPoint = new firebase.firestore.GeoPoint(placeDetails.geometry.location.lat(), placeDetails.geometry.location.lng());

          this.mapService.updatePosition(geoPoint);
          this.mapService.zoomToCity();
          place.geoPoint = geoPoint;

          if (this.podcast && addToPodcast) {
            if (this.addPlaceIfUnique(place)) {
              console.log('add to podcast');
              this.podcast.placeIds[place.place_id] = true;
            }
            this.podcastPlace = ''; // reset add place input
          }
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

  addLocationText() {
    return (this.places.length === 0) ? 'Suggest a location' : 'Add a location';
  }

  submitLocationSuggestion() {
    const podSugg: PodcastSuggestion = {
      podcast: this.podcast,
      locations: [],
      status: SuggestionStatus.Unmoderated
    };

    this.places.forEach(place => {
      const podLocation: PodcastLocation = {
        name: place.description,
        geoPoint: place.geoPoint,
        placeId: place.place_id
      };
      podSugg.locations.push(podLocation);
    })

    this.afs.collection('suggestions').add(podSugg).then(() => {
      this.submitted = true;
    }, err => console.error('Error connecting to firebase', err));

  }

  clearPodcast() {
    this.submitted = false;
    this.podcast = null;
  }

  goToUserLocation() {
    if (!this.fetchingLocation && 'geolocation' in navigator) {
      this.searchLocation = 'Getting location…';
      this.fetchingLocation = true;
      navigator.geolocation.getCurrentPosition(position => {
        this.resetSearchLocationString();
        const geoPoint = new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude);
        this.mapService.updatePosition(geoPoint);
        this.mapService.zoomToCity();

      }, (error) => {
        console.error('geolocation error', error);
      }, {
        timeout: 10000
      });
    }
  }

}
