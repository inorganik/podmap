import { Component, OnInit, AfterViewInit, ViewChild, ApplicationRef, ViewEncapsulation } from '@angular/core';
import { AgmMap } from '@agm/core';
import { DomSanitizer } from '@angular/platform-browser';
import { mapStyle } from './podmap.mapstyle';
import { MatIconRegistry } from '@angular/material';
import { Observable } from 'rxjs';
import { MapService } from './map.service';
import * as firebase from 'firebase/app';

declare const navigator;
declare let google: any;


@Component({
  selector: 'pm-podmap',
  templateUrl: './podmap.component.html',
  styleUrls: ['./podmap.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PodmapComponent implements OnInit, AfterViewInit {

  geoPoint: firebase.firestore.GeoPoint;
  zoom = 5;
  mapStyle = mapStyle;

  @ViewChild(AgmMap) agmMap;

  constructor(
    private mapService: MapService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    // icons
    const iconPath = '../../assets/icons/';
    iconRegistry.addSvgIcon('close', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'ic_close_black_24px.svg'));
    iconRegistry.addSvgIcon('location', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'ic_location_on_black_24px.svg'));
    iconRegistry.addSvgIcon('my-location', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'ic_my_location_black_24px.svg'));
    iconRegistry.addSvgIcon('search', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'ic_search_black_24px.svg'));
    iconRegistry.addSvgIcon('done', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'ic_done_black_24px.svg'));
    iconRegistry.addSvgIcon('podmap', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'podmap-icon.svg'));
  }

  ngOnInit() {
    this.mapService.position$.subscribe(pos => this.position = pos);
    this.mapService.zoom$.subscribe(zoom => this.zoom = zoom);
  }

  ngAfterViewInit() {
    // place details service
    this.agmMap.mapReady.subscribe(map => {
      this.mapService.placesService = new google.maps.places.PlacesService(map);
    }).unsubscribe();
  }

  // currently not used
  zoomToUserLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        this.geoPoint = new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude);
        this.zoom = 10;

      }, (error) => {
        console.error('geolocation error', error);
      }, {
        timeout: 10000
      });
    }
  }

}
