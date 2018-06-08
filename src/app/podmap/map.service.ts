import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class MapService {

  // centered over US
  initialPositionUS = new firebase.firestore.GeoPoint(37, -97);
  initialZoom = 5;
  cityZoom = 12;
  placesService: any = null;

  geoPoint$ = new BehaviorSubject<firebase.firestore.GeoPoint>(this.initialPositionUS);
  zoom$ = new BehaviorSubject(this.initialZoom);

  constructor() { }

  updatePosition(geoPoint: firebase.firestore.GeoPoint) {
    this.geoPoint$.next(geoPoint);
  }
  zoomToCity() {
    this.zoom$.next(this.cityZoom);
  }
}
