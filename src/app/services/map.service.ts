import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase/app';

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

  constructor() { }

  updatePosition(geoPoint: firebase.firestore.GeoPoint) {
    this.geoPoint$.next(geoPoint);
  }
  zoomToCity() {
    this.zoom$.next(this.cityZoom);
  }

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
}
