import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ApplicationRef, ViewEncapsulation } from '@angular/core';
import { AgmMap } from '@agm/core';
import { DomSanitizer } from '@angular/platform-browser';
import { mapStyle } from './podmap.mapstyle';
import { MatIconRegistry } from '@angular/material';
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

export class PodmapComponent implements OnInit, AfterViewInit, OnDestroy {

  geoPoint: firebase.firestore.GeoPoint;
  zoom = 5;
  mapStyle = mapStyle;

  @ViewChild(AgmMap) agmMap: AgmMap;

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
    this.mapService.geoPoint$.subscribe(pos => this.geoPoint = pos);
    this.mapService.zoom$.subscribe(zoom => this.zoom = zoom);
  }

  ngOnDestroy() {
    this.mapService.geoPoint$.unsubscribe();
    this.mapService.zoom$.unsubscribe();
  }

  ngAfterViewInit() {
    // place details service
    this.agmMap.mapReady.subscribe(map => {
      this.mapService.placesService = new google.maps.places.PlacesService(map);
      this.agmMap.mapReady.unsubscribe();
    });
  }

}
