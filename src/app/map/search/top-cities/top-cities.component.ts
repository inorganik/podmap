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

  constructor(
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
    this.cities$ = this.afs.collection<PodcastLocation>('locations', ref =>
      ref.orderBy('podCount', 'desc').limit(10)
    ).valueChanges();
  }

}
