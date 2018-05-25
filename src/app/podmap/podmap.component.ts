import { Component, AfterViewInit, ViewChild, ApplicationRef } from '@angular/core';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { mapStyle } from './podmap.mapstyle';
import { MatIconRegistry } from '@angular/material';
import { AgmMap } from '@agm/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { Podcast, PodcastLocation, SuggestionStatus, PodcastSuggestion } from './podmap.models';
// angularfire
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Place } from './place-search/place-search.component';

declare const navigator;
declare let google: any;


@Component({
	selector: 'sf-podmap',
	templateUrl: './podmap.component.html',
	styleUrls: ['./podmap.component.scss']
})

export class PodmapComponent implements AfterViewInit {

	// centered over US
	lat = 37;
	lng = -97;
	zoom = 5;
	mapStyle = mapStyle;

	loading = false;

	podcast: PodcastSuggestion;
	place: Place;
	podcastSubjectState: any;
	// google apis
	placesService: any;
	// firestore
	suggestionCollection: AngularFirestoreCollection<PodcastSuggestion>;

	@ViewChild(AgmMap) agmMap;

	constructor(
		titleService: Title,
		iconRegistry: MatIconRegistry,
		sanitizer: DomSanitizer,
		private applicationRef: ApplicationRef,
		private afs: AngularFirestore
	) {
		titleService.setTitle('PODMAP');
		// icons
		const iconPath = '../../assets/icons/';
		iconRegistry.addSvgIcon('close', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'ic_close_black_24px.svg'));
		iconRegistry.addSvgIcon('location', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'ic_location_on_black_24px.svg'));
		iconRegistry.addSvgIcon('my-location', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'ic_my_location_black_24px.svg'));
		iconRegistry.addSvgIcon('search', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'ic_search_black_24px.svg'));
		iconRegistry.addSvgIcon('done', sanitizer.bypassSecurityTrustResourceUrl(iconPath + 'ic_done_black_24px.svg'));
		// firestore
		this.suggestionCollection = afs.collection('suggestions');
		// misc
		this.resetSubjectState();
	}

	ngAfterViewInit() {
		// place details service
		this.agmMap.mapReady.subscribe(map => {
			this.placesService = new google.maps.places.PlacesService(map);
		});
	}

	resetSubjectState() {
		this.podcastSubjectState = {
			hasLocation: false,
			submitted: false
		};
	}

	// currently not used
	zoomToUserLocation() {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(position => {
				this.lat = position.coords.latitude;
				this.lng = position.coords.longitude;
				this.zoom = 10;

			}, (error) => {
				console.error('geolocation error', error);
			}, {
					timeout: 10000
				});
		}
	}

	// podcast chosen from typeahead
	setPodcast(podcast: Podcast) {
		if (podcast) {
			// TODO: lookup podcast, check for location
			this.resetSubjectState(); // temp, assume not in db
			this.podcast = {
				collectionId: podcast.collectionId,
				collectionName: podcast.collectionName,
				artistName: podcast.artistName,
				artworkUrl60: podcast.artworkUrl60,
				artworkUrl100: podcast.artworkUrl100
			};
		}
		else {
			this.podcast = null;
			this.resetSubjectState();
		}
	}

	// place chosen from typeahead
	setPlace(place: Place) {
		this.place = place;
		if (this.placesService) {
			this.loading = true;
			this.placesService.getDetails({
				placeId: this.place.place_id
			}, (placeDetails, status) => {
				this.loading = false;
				if (status === google.maps.places.PlacesServiceStatus.OK) {
					// console.log('place details!', placeDetails);
					this.lat = placeDetails.geometry.location.lat();
					this.lng = placeDetails.geometry.location.lng();
					this.zoom = 12;
					this.place.location = {
						lat: this.lat,
						lng: this.lng
					};
					this.applicationRef.tick();
				}
				else {
					console.error(status);
				}
			});
		}
	}

	submitLocation() {
		// do stuff
		const geoPoint = new firebase.firestore.GeoPoint(this.place.location.lat, this.place.location.lng);
		this.podcast.locationName = this.place.description;
		this.podcast.geoPoint = geoPoint;
		this.podcast.placeId = this.place.place_id;
		this.podcast.status = 0;
		console.log('submit suggestion', this.podcast);
		// this.suggestionCollection.add(thid.podcast);
		this.podcastSubjectState.submitted = true;

		// const placeDoc = this.afs.doc<PodcastLocation>(`locations/${this.place.placeId}`);
		// const podcasts = placeDoc.collection<Podcast>('podcasts').add

	}

	clearPodcast() {
		this.resetSubjectState();
		this.podcast = null;
	}

}
