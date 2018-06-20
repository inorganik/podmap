import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Podcast } from '../models';

@Component({
  selector: 'pm-podcast-list',
  templateUrl: './podcast-list.component.html'
})
export class PodcastListComponent {

  @Input()
  podcasts$: Observable<Podcast[]>;

  constructor() { }

}
