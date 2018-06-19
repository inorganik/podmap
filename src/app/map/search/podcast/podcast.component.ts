import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Podcast, PodcastLocation, Place, SuggestionStatus, PodcastSuggestion } from '../../models';
import { switchMap, concat, merge, mergeMap, tap, first, map } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, of } from 'rxjs';
import { MapService } from '../../../services/map.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'pm-podcast',
  templateUrl: './podcast.component.html',
  styleUrls: ['./podcast.component.scss']
})
export class PodcastComponent implements OnInit {

  MAX_POD_LOCATIONS = 10;

  podcast$: Observable<Podcast>;
  // suggesting locations
  podPlace: Place;
  podLocations: PodcastLocation[] = [];
  loading = false;
  submitted = false;
  collectionId: string;

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private mapService: MapService
  ) { }

  ngOnInit() {
    this.podcast$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.collectionId = params.get('collectionId');
        return this.afs.doc<Podcast>(`podcasts/${this.collectionId}`).valueChanges();
      }),
      mergeMap(afsResult => {
        console.log('afs result', afsResult);
        if (afsResult === undefined) {
          if (this.mapService.podcast && Number(this.collectionId) === this.mapService.podcast.collectionId) {
            console.log('return cached', this.mapService.podcast);
            return of(this.mapService.podcast);
          }
          console.log('return not found');
          return of(null);
        } else {
          console.log('return afs result', afsResult);
          return of(afsResult);
        }
      })
    );
  }

  // suggesting locations

  canAddPlace(): Boolean {
    return this.podLocations.length <= this.MAX_POD_LOCATIONS;
  }

  addPlaceIfUnique(place: Place): Boolean {
    this.podLocations.forEach(plc => {
      if (plc.placeId === place.place_id) {
        return false;
      }
    });
    return true;
  }

  setPlace(place: Place) { // place chosen from typeahead

    this.podPlace = place;
    if (this.addPlaceIfUnique(place) && this.canAddPlace()) {
      this.loading = true;
      this.mapService.getPlaceDetails(place.place_id)
        .then(placeDetails => {
          // console.log('place details', placeDetails);
          this.loading = false;
          const geoPoint = new firebase.firestore.GeoPoint(placeDetails.geometry.location.lat(), placeDetails.geometry.location.lng());

          this.mapService.updatePosition(geoPoint);
          this.mapService.zoomToCity();

          this.podLocations.push({
            description: place.description,
            lat: geoPoint.latitude,
            lng: geoPoint.longitude,
            placeId: placeDetails.place_id
          });
          this.podPlace = null; // clear place search

        }, err => console.error('Error getting place details', err));
    }
  }

  addLocationText() {
    return (this.podLocations.length === 0) ? 'Suggest a location' : 'Add a location';
  }

  submitLocationSuggestion(podcast: Podcast) {
    // make a copy so we can show correct UI state
    const pod = { ...podcast};
    pod.locations = this.podLocations;
    this.podLocations.forEach(location => {
      pod.placeIds[location.placeId] = true;
    });
    const podSugg: PodcastSuggestion = {
      podcast: pod,
      status: SuggestionStatus.Unmoderated
    };

    this.afs.collection('suggestions').add(podSugg).then(() => {
      this.submitted = true;
      console.log('submitted!');
    }, err => console.error('Firebase error:', err));
  }

}
