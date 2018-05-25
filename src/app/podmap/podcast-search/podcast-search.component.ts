import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
	debounceTime,
	distinctUntilChanged,
	switchMap
} from 'rxjs/operators';
import { Podcast } from '../podmap.models';

@Component({
	selector: 'sf-podcast-search',
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

	@Output() onSelected = new EventEmitter<any>();

	constructor(private http: HttpClient) { }

	ngOnInit() {
		this.podcasts$ = this.podcastCtrl.valueChanges.pipe(
			debounceTime(this.keyupDelay),
			distinctUntilChanged(),
			switchMap(searchTerm => this.itunesSearch(searchTerm))
		);
	}

	itunesSearch(searchTerm): Observable<Podcast[]> {
		if (searchTerm && searchTerm.length > 0) {
			const params = new HttpParams()
			.set('media', 'podcast')
			.set('term', searchTerm)
			.set('limit', '10')
			.set('explicit', 'Yes');

			const itunesUrl = this.itunesEndpoint + params.toString();

			return Observable.create(obs => {
				this.http.jsonp<any>(itunesUrl, 'callback').subscribe(response => {
					if (response && response.resultCount > 0) {
						obs.next(response.results.slice());
					}
					else {
						obs.next([
							{ collectionName: 'No results', artistName: '' }
						]);
					}
					obs.complete();
				}, error => {
					console.error('error', error);
					obs.complete();
				});
			});
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
		console.log('selected', podcast.option.value);
		this.podcast = podcast.option.value;
		this.onSelected.emit(this.podcast);
	}

	clearPod() {
		this.podcast = null;
		this.podcastCtrl.setValue('');
		this.onSelected.emit(null);
	}

}
