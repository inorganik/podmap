import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { PodcastLocation } from '../models';

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

  constructor() { }

  ngOnInit() {
  }

}
