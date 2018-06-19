import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PodcastLocation } from '../../models';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';
import { MapService } from '../../../services/map.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'pm-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  location$: Observable<PodcastLocation>;
  // podcasts$: Observable<Podcast[]>;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private mapService: MapService
  ) { }

  ngOnInit() {
    this.location$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const placeId = params.get('placeId');
        return this.afs.doc<PodcastLocation>(`locations/${placeId}`).valueChanges().pipe(
          tap(location => {
            this.loading = false;
            if (location !== undefined) {
              const geoPoint = new firebase.firestore.GeoPoint(location.lat, location.lng);
              this.mapService.updatePosition(geoPoint);
              this.mapService.zoomToCity();
            }
          })
        );
      })
    );
  }

}
