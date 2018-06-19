import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { PodcastLocation } from '../models';
import { Router } from '@angular/router';

@Component({
  selector: 'pm-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent implements OnInit {

  @Input()
  locations$: Observable<PodcastLocation[]>;

  @Input()
  locations: PodcastLocation[];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  routeLocation(placeId: string) {
    this.router.navigateByUrl(`/search/location/${placeId}`);
  }

}
