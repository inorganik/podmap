import { AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

export interface Categories {
  [key: string]: Boolean;
}

export interface Podcast {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl60: string;
  artworkUrl100: string;
  feedUrl: string;
  itunesSub: string;
  placeIds: Categories;
  locations: PodcastLocation[];
  // it's very cumbersome to look up each location by place id
  // much simpler to just include locations
}

export interface PodcastLocation {
  description: string;
  // storing root-level lat/lng allows for better querying
  lat: number;
  lng: number;
  place_id: string;
  podCount?: number;
}

export enum SuggestionStatus {
  Unmoderated,
  Approved,
  Rejected
}

export interface PodcastSuggestion {
  podcast: Podcast;
  locations: Array<PodcastLocation>;
  status?: SuggestionStatus;
}

// a partial typing of PlaceService result + lat & lng
export interface Place {
  description: string;
  matched_substrings?: [any];
  place_id: string;
  terms: [any];
  types: [string];
  geoPoint?: firebase.firestore.GeoPoint;
}
