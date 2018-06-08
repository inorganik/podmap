import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap
} from 'rxjs/operators';
import { Place } from '../../models';


declare let google: any;

@Component({
  selector: 'pm-place-search',
  templateUrl: './place-search.component.html'
})

export class PlaceSearchComponent implements OnInit {

  autocompleteService: any;

  placeCtrl = new FormControl();
  keyupDelay = 500;
  places$: Observable<any>;

  @Output() selected = new EventEmitter<Place>();

  constructor(
    private loader: MapsAPILoader
  ) { }

  ngOnInit() {
    this.loader.load().then(() => {
      this.autocompleteService = new google.maps.places.AutocompleteService();
    });

    this.places$ = this.placeCtrl.valueChanges.pipe(
      debounceTime(this.keyupDelay),
      distinctUntilChanged(),
      switchMap(searchTerm => this.placeSearch(searchTerm))
    );
  }

  placeSearch(searchTerm): Observable<Place[]> {
    if (searchTerm.length > 0) {
      if (!this.autocompleteService) {
        console.error('No autocomplete service');
        return of([]);
      }
      return Observable.create(obs => {
        const getPredicts = (predictions, status) => {
          // console.log('got predicts', predictions, status);
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            obs.next(predictions.slice());
          }
          else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            obs.next([
              { description: 'No results' }
            ]);
          }
          else {
            console.error(status);
            obs.next([
              { description: 'Server error' }
            ]);
          }
          obs.complete();
        };

        this.autocompleteService.getPlacePredictions({
          input: searchTerm,
          types: ['(regions)']
        }, getPredicts);
      });
    }
    else {
      return of([]);
    }
  }

  // different view/model values for autocomplete
  displayFn(place: Place) {
    return place ? place.description : '';
  }

  selectedPlace(place) {
    // console.log('place', place);
    this.selected.emit(place.option.value);
  }

}
