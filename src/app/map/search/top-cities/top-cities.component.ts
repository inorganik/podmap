import { Component, OnInit } from '@angular/core';
import { PodcastLocation } from '../../models';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'pm-top-cities',
  templateUrl: './top-cities.component.html',
  styleUrls: ['./top-cities.component.scss']
})
export class TopCitiesComponent implements OnInit {

  cities$: Observable<PodcastLocation[]>;
  hideTopCities = false;
  numberOfCities = 5;
  maxNumberOfCities = 10;
  moreCitiesText = 'show more';

  constructor(
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
    this.cities$ = this.afs.collection<PodcastLocation>('locations', ref =>
      ref.orderBy('podCount', 'desc').limit(this.maxNumberOfCities)
    ).valueChanges();
  }

  toggleTopCities() {
    if (this.numberOfCities === 5) {
      this.numberOfCities = 10;
      this.moreCitiesText = 'show less';
    } else {
      this.numberOfCities = 5;
      this.moreCitiesText = 'show more';
    }
  }

}
