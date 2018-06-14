import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { Podcast, Place } from '../models';
// angularfire
import { MapService } from '../../services/map.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'pm-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {

  loading = false;
  route$;
  // for find my location
  searchLocation: string;
  fetchingLocation = false;

  constructor(
    private mapService: MapService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetSearchLocationString();
  }

  ngOnInit() {
    console.log('search component init');
    this.route$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        console.log('route changed', params);
        return null;
      }));
  }

  resetSearchLocationString() {
    this.searchLocation = 'Search my location »';
    this.fetchingLocation = false;
  }

  // podcast chosen from typeahead
  setPodcast(podcast: any) {
    // console.log('podcast', podcast);
    if (podcast) {
      const pod: Podcast = {
        collectionId: podcast.collectionId,
        collectionName: podcast.collectionName,
        artistName: podcast.artistName,
        artworkUrl60: podcast.artworkUrl60,
        artworkUrl100: podcast.artworkUrl100,
        feedUrl: podcast.feedUrl,
        itunesSub: podcast.trackViewUrl
      };
      this.mapService.podcast = pod;
      this.router.navigate(['search/podcast', podcast.collectionId]);
      // this.mapService.addOrUpdatePodcast(pod)
      //   .then(() => {
      //     this.router.navigate(['search/podcast', podcast.collectionId]);
      //   }, err => console.error('Error adding podcast:', err));
    }
  }

  // place chosen from typeahead
  setPlace(place: Place) {

    this.loading = true;
    this.mapService.getPlaceDetails(place.place_id)
      .then(placeDetails => {
        this.loading = false;
        const geoPoint = new firebase.firestore.GeoPoint(placeDetails.geometry.location.lat(), placeDetails.geometry.location.lng());
        this.mapService.updatePosition(geoPoint);
        this.mapService.zoomToCity();

        // TODO: route to location

      }, err => console.error('Error getting place details', err));
  }

  goToUserLocation() {
    if (!this.fetchingLocation && 'geolocation' in navigator) {
      this.searchLocation = 'Getting location…';
      this.fetchingLocation = true;
      window.navigator.geolocation.getCurrentPosition(position => {
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
