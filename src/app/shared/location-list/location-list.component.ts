import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { PodcastLocation } from '../../map/models';

@Component({
  selector: 'pm-location-list',
  templateUrl: './location-list.component.html'
})
export class LocationListComponent {

  @Input()
  locations$: Observable<PodcastLocation[]>;

  @Input()
  locations: PodcastLocation[];

  constructor() { }

}
