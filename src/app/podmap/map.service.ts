import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Position } from './models';


@Injectable({
  providedIn: 'root'
})
export class MapService {

  // centered over US
  initialPositionUS: Position = {
    lat: 37,
    lng: -97
  };
  initialZoom = 5;
  cityZoom = 12;
  placesService: any = null;

  position$ = new BehaviorSubject<Position>(this.initialPositionUS);
  zoom$ = new BehaviorSubject(this.initialZoom);

  constructor() { }

  updatePosition(pos: Position) {
    this.position$.next(pos);
  }
  zoomToCity() {
    this.zoom$.next(this.cityZoom);
  }
}
