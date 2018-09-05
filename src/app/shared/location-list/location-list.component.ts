import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { PodcastLocation, Podcast } from '../../map/models';

@Component({
  selector: 'pm-location-list',
  templateUrl: './location-list.component.html',
  styles: [ 'li { padding-right: 5px }']
})
export class LocationListComponent {

  @Input()
  locations$: Observable<PodcastLocation[]>;

  @Input()
  limit = 99;

  @Input()
  locations: PodcastLocation[];

  @Input()
  canEdit = false;

  @Output()
  remove = new EventEmitter<PodcastLocation>();

  removeLocation(location: PodcastLocation) {
    this.remove.emit(location);
  }

}
