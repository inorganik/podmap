import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';
import { PodcastLocation, Podcast } from '../map/models';

declare let google: any;

@Injectable({
  providedIn: 'root'
})
export class MapService {

  // centered over US
  initialPositionUS = new firebase.firestore.GeoPoint(37, -97);
  initialZoom = 5;
  cityZoom = 12;

  placesService: any;

  geoPoint$ = new BehaviorSubject<firebase.firestore.GeoPoint>(this.initialPositionUS);
  zoom$ = new BehaviorSubject(this.initialZoom);

  // act as a store for podcasts not in firestore yet
  private _podcast: Podcast;
  get podcast(): Podcast {
    return this._podcast;
  }
  set podcast(pod: Podcast) {
    this._podcast = pod;
  }

  constructor(private afs: AngularFirestore) { }

  updatePosition(geoPoint: firebase.firestore.GeoPoint) {
    this.geoPoint$.next(geoPoint);
  }
  zoomToCity() {
    this.zoom$.next(this.cityZoom);
  }

  // firestore

  getPlaceDetails(placeId): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (this.placesService) {
        this.placesService.getDetails({
          placeId: placeId
        }, (placeDetails, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(placeDetails);
          }
          else {
            console.error(status);
            reject();
          }
        });
      }
      else {
        console.error('No place service');
        reject();
      }
    });
  }

  addOrUpdateLocation(location: PodcastLocation): Promise<any> {
    return new Promise((resolve, reject) => {
      const docPath = `locations/${location.placeId}`;
      // try to update first
      this.afs.doc(docPath).update(location)
        .then(() => resolve())
        .catch(() => {
          // doc doesn't exist, add
          location.podCount = 0;
          this.afs.doc(docPath).set(location)
            .then(() => resolve())
            .catch(err => reject(err));
        });
      });
  }
  addOrUpdatePodcast(podcast: Podcast): Promise<any> {
    return new Promise((resolve, reject) => {
      const docPath = `podcasts/${podcast.collectionId}`;
      // try to update first
      this.afs.doc(docPath).update(podcast)
        .then(() => resolve())
        .catch(() => {
          // doc doesn't exist, add
          podcast.locations = [];
          podcast.placeIds = {};
          this.afs.doc(docPath).set(podcast)
            .then(() => resolve())
            .catch(err => reject(err));
        });
      });
  }

  getLocation(location: PodcastLocation): Promise<PodcastLocation> {
    return new Promise((resolve, reject) => {
      const docPath = `locations/${location.placeId}`;
      this.afs.doc<PodcastLocation>(docPath).valueChanges().toPromise()
        .then(loc => resolve(loc))
        .catch(() => resolve(location));
    });
  }
}
