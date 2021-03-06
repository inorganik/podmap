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

  MAX_MARKERS_IN_DOC = 1000; // max locs that can safely be stored in 1 firestore doc

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
      // console.log('add location to markers:', location.description);
      this.markers.push(loc);
    }
  }

  removeLocationFromMarkers(location: PodcastLocation) {
    this.markers = this.markers.filter(podLoc => podLoc.placeId !== location.placeId);
  }

  // break markers into groups of MAX_MARKERS_IN_DOC
  // and persist groups as individual docs
  persistMarkers(): Promise<any> {
    let startIndex = 0;
    const markerGroups: MarkerObj[] = [];
    while (startIndex < this.markers.length) {
      markerGroups.push({ markers: this.markers.slice(startIndex, startIndex + this.MAX_MARKERS_IN_DOC) });
      startIndex += this.MAX_MARKERS_IN_DOC;
    }
    const promises: Promise<any>[] = [];
    markerGroups.forEach((group, i) => {
      promises.push(this.afs.collection('markers').doc(i + '').set(group));
    });
    return Promise.all(promises);
  }

  // true: location created, false: location updated
  addOrUpdateLocation(location: PodcastLocation): Promise<boolean> {
    // console.log('add or update loc', location);
    return new Promise((resolve, reject) => {
      const docPath = `locations/${location.placeId}`;
      // try to update first
      this.afs.doc(docPath).update(location)
        .then(() => resolve(false))
        .catch(() => {
          // doc doesn't exist, add
          this.afs.doc(docPath).set(location)
            .then(() => {
              this.addLocationToMarkers(location);
              resolve(true);
            })
            .catch(err => reject(err));
        });
      });
  }

  // true: location created, false: location updated
  getAndIncrementPodCountForLocation(location: PodcastLocation): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.getLocation(location)
        .then(loc => {
          if (loc.podCount === undefined) {
            loc.podCount = 1;
          } else {
            loc.podCount = loc.podCount + 1;
          }
          this.addOrUpdateLocation(loc)
            .then(created => resolve(created))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }

  // true: podcast created, false: podcast updated
  addOrUpdatePodcast(podcast: Podcast): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const docPath = `podcasts/${podcast.collectionId}`;
      // try to update first
      this.afs.doc(docPath).update(podcast)
        .then(() => resolve(false))
        .catch(() => {
          // doc doesn't exist, add
          podcast.locations = [];
          podcast.placeIds = {};
          this.afs.doc(docPath).set(podcast)
            .then(() => resolve(true))
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
          console.error('getLocation():', err);
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
          if (pod === undefined || (pod && !pod.locations.length)) {
            this.afs.doc(docPath).set(podcast)
              .then(() => resolve(podcast));
          }
          else {
            reject('Pod already exists');
          }
        })
        .catch(err => {
          console.error('safelyAddPodcast():', err);
          reject(err);
        });
    });
  }

  incrementPodcastCount(): Promise<any> {
    return new Promise((resolve, reject) => {
      const docPath = 'meta/counts';
      this.afs.doc<MetaCounts>(docPath).valueChanges().pipe(
        first()
      ).toPromise()
        .then(counts => {
          if (counts === undefined) {
            const count: MetaCounts = {
              podcastCount: 1
            };
            this.afs.doc(docPath).set(count)
              .then(() => resolve())
              .catch(err => reject(err));
          } else {
            counts.podcastCount = counts.podcastCount + 1;
            this.afs.doc(docPath).update(counts)
              .then(() => resolve())
              .catch(err => reject(err));
          }
        })
        .catch(err => {
          console.error('incrementPodcastCount():', err);
          reject(err);
        });
    });
  }

  removeLocationFromPodcast(location: PodcastLocation, podcast: Podcast) {
    podcast.locations = podcast.locations.filter(loc => {
      return loc.placeId !== location.placeId;
    });
    if (podcast.placeIds[location.placeId]) {
      delete podcast.placeIds[location.placeId];
    }
    this.addOrUpdatePodcast(podcast).then(() => {
      this.getLocation(location).then(loc => {
        loc.podCount = loc.podCount - 1;
        if (loc.podCount === 0) {
          this.removeLocationFromMarkers(location);
          this.persistMarkers();
        }
        this.addOrUpdateLocation(loc).then(() => console.log('successfully removed location'))
          .catch(err => console.error('removeLocationFromPodcast():', err));
      });
    });
  }
}
