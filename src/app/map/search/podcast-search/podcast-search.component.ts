import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map
} from 'rxjs/operators';
import { Podcast } from '../../models';

@Component({
  selector: 'pm-podcast-search',
  templateUrl: './podcast-search.component.html',
  styleUrls: ['./podcast-search.component.scss']
})
export class PodcastSearchComponent implements OnInit {

  podcastCtrl = new FormControl();
  podcasts$: Observable<any>;
  keyupDelay = 500;
  itunesEndpoint = 'https://itunes.apple.com/search?';

  private _podcast: Podcast;
  get podcast(): Podcast {
    return this._podcast;
  }
  @Input()
  set podcast(val: Podcast) {
    this._podcast = val;
    this.podcastCtrl.setValue(this._podcast);
  }

  @Output() selected = new EventEmitter<any>();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.podcasts$ = this.podcastCtrl.valueChanges.pipe(
      debounceTime(this.keyupDelay),
      distinctUntilChanged(),
      switchMap(searchTerm => this.itunesSearch(searchTerm)),
      map((response: any) => {
        if (response && response.resultCount > 0) {
          return response.results;
        }
        else {
          return [
            { collectionName: 'No results', artistName: '' }
          ];
        }
      })
    );
  }

  itunesSearch(searchTerm): any {
    if (searchTerm && searchTerm.length > 0) {
      const params = new HttpParams()
        .set('media', 'podcast')
        .set('term', searchTerm)
        .set('limit', '10')
        .set('explicit', 'Yes');
      const itunesUrl = this.itunesEndpoint + params.toString();

      return this.http.jsonp<any>(itunesUrl, 'callback');
    }
    else {
      return of([]);
    }
  }

  // different view/model values for autocomplete
  displayFn(podcast: Podcast) {
    return podcast ? podcast.collectionName : '';
  }

  selectedPod(podcast) {
    this.podcast = podcast.option.value;
    this.selected.emit(this.podcast);
  }

  clearPod() {
    this.podcast = null;
    this.podcastCtrl.setValue('');
    this.selected.emit(null);
  }

}
