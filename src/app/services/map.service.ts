import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';
import { PodcastLocation, Podcast, MetaCounts, MarkerObj } from '../map/models';
import { first } from 'rxjs/operators';

declare let google: any;

@Injectable({
  providedIn: 'root'
})
export class MapService {

  // initialPositionUS = new firebase.firestore.GeoPoint(37, -97);
  initialPositionWorld = new firebase.firestore.GeoPoint(7, -99);
  initialZoom = 3;
  cityZoom = 12;
  markers: Partial<PodcastLocation>[] = [];

  placesService: any;

  geoPoint$ = new BehaviorSubject<firebase.firestore.GeoPoint>(this.initialPositionWorld);
  zoom$ = new BehaviorSubject(this.initialZoom);

  // routing cache
  podcast: Podcast;

  MAX_MARKERS_IN_DOC = 1500; // approx how many locs can be stored in 1 firestore doc

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
            reject(status);
          }
        });
      }
      else {
        reject('No place service');
      }
    });
  }

  addLocationToMarkers(location: PodcastLocation) {
    const loc = {
      lat: location.lat,
      lng: location.lng,
      placeId: location.placeId
    };
    if (this.markers.filter(podLoc => podLoc.placeId === loc.placeId).length === 0) {
      this.markers.push(loc);
    }
  }

  persistMarkers(): Promise<any> {
    const obj: MarkerObj = { markers: this.markers };
    return new Promise((resolve, reject) => {
        if (this.markers.length > 1500) {
          reject('max size reached for markers firestore doc');
        }
        const docPath = `meta/markers`;
        this.afs.doc(docPath).update(obj)
          .then(() => resolve())
          .catch(() => {
            // doc doesn't exist, add
            this.afs.doc(docPath).set(obj)
              .then(() => resolve())
              .catch(err => reject(err));
          });
    });
  }

  addOrUpdateLocation(location: PodcastLocation): Promise<any> {
    // console.log('add or update loc', location);
    return new Promise((resolve, reject) => {
      const docPath = `locations/${location.placeId}`;
      // try to update first
      this.afs.doc(docPath).update(location)
        .then(() => resolve())
        .catch(() => {
          // doc doesn't exist, add
          this.afs.doc(docPath).set(location)
            .then(() => {
              this.addLocationToMarkers(location);
              this.persistMarkers()
                .then(() => resolve())
                .catch(err => reject(err));
            })
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

  // return persisted entity if it exists, else return passed entity (promise)
  getLocation(location: PodcastLocation): Promise<PodcastLocation> {
    return new Promise(resolve => {
      const docPath = `locations/${location.placeId}`;
      this.afs.doc<PodcastLocation>(docPath).valueChanges().pipe(
        first()
      ).toPromise()
        .then(loc => {
          if (loc === undefined) {
            resolve(location);
          } else {
            resolve(loc);
          }
        })
        .catch(err => {
          console.error('oops', err);
          resolve(location);
        });
    });
  }

  // only add podcast if it isn't in the DB yet
  safelyAddPodcast(podcast: Podcast): Promise<Podcast> {
    return new Promise((resolve, reject) => {
      const docPath = `podcasts/${podcast.collectionId}`;
      this.afs.doc<Podcast>(docPath).valueChanges().pipe(
        first()
      ).toPromise()
        .then(pod => {
          if (pod === undefined) {
            this.afs.doc(docPath).set(podcast)
              .then(() => resolve(podcast));
          }
          else {
            reject('Pod already exists');
          }
        })
        .catch(err => {
          console.error('huh?', err);
          reject(err);
        });
    });
  }

  // increment count for 'podcast' or 'location'
  incrementCount(countToIncrement: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const docPath = 'meta/counts';
      this.afs.doc<MetaCounts>(docPath).valueChanges().pipe(
        first()
      ).toPromise()
        .then(counts => {
          if (counts === undefined) {
            const count: MetaCounts = {
              podcastCount: (countToIncrement === 'podcast') ? 1 : 0,
              locationCount: (countToIncrement === 'location') ? 1 : 0
            };
            this.afs.doc(docPath).set(count)
              .then(() => resolve())
              .catch(err => reject(err));
          } else {
            if (countToIncrement === 'podcast') {
              counts.podcastCount = counts.podcastCount + 1;
            } else {
              counts.locationCount = counts.locationCount + 1;
            }
            this.afs.doc(docPath).update(counts)
              .then(() => resolve())
              .catch(err => reject(err));
          }
        })
        .catch(err => {
          console.error('oops', err);
          reject(err);
        });
    });
  }
}
