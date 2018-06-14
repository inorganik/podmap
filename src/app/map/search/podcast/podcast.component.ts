import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Podcast, PodcastLocation, Place, SuggestionStatus, PodcastSuggestion } from '../../models';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { MapService } from '../../../services/map.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'pm-podcast',
  templateUrl: './podcast.component.html',
  styleUrls: ['./podcast.component.scss']
})
export class PodcastComponent implements OnInit {

  podcast$: Observable<Podcast>;
  // suggesting locations
  podPlace: Place;
  podPlaces: Place[] = [];
  loading = false;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private mapService: MapService
  ) { }

  ngOnInit() {
    this.podcast$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const collectionId = params.get('collectionId');
        return this.afs.doc<Podcast>(`podcasts/${collectionId}`).valueChanges();
      })
    );
  }

  // suggesting locations

  addPlaceIfUnique(place: Place): Boolean {
    this.podPlaces.forEach(plc => {
      if (plc.place_id === place.place_id) {
        return false;
      }
    });
    return true;
  }

  setPlace(place: Place) { // place chosen from typeahead

    if (this.addPlaceIfUnique(place)) {
      this.loading = true;
      this.mapService.getPlaceDetails(place.place_id)
        .then(placeDetails => {
          console.log('place details', placeDetails);
          this.loading = false;
          const geoPoint = new firebase.firestore.GeoPoint(placeDetails.geometry.location.lat(), placeDetails.geometry.location.lng());

          this.mapService.updatePosition(geoPoint);
          this.mapService.zoomToCity();

          // TODO add to podPlaces array

        }, err => console.error('Error getting place details', err));
    }
  }

  addLocationText() {
    return (this.podPlaces.length === 0) ? 'Suggest a location' : 'Add a location';
  }

  submitLocationSuggestion(podcast: Podcast) {
    const podSugg: PodcastSuggestion = {
      podcast: podcast,
      locations: [],
      status: SuggestionStatus.Unmoderated
    };
    // populate locations in suggestion
    this.podPlaces.forEach(place => {
      const podLocation: PodcastLocation = {
        description: place.description,
        lat: place.geoPoint.latitude,
        lng: place.geoPoint.longitude,
        place_id: place.place_id
      };
      podSugg.locations.push(podLocation);
    });

    this.afs.collection('suggestions').add(podSugg).then(() => {
      this.submitted = true;
    }, err => console.error('Error connecting to firebase', err));
  }

}
