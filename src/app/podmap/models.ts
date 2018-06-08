import { AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

export interface Podcast {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl60: string;
  artworkUrl100: string;
  locations?: Array<PodcastLocation>;
}

export interface PodcastLocation {
  name: string;
  geoPoint: any;
  placeId: string;
  podCount?: number;
  podcasts?: Array<Podcast>;
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

// a partial typing of PlaceService result + geoPoint
export interface Place {
  description: string;
  matched_substrings?: [any];
  place_id: string;
  terms: [any];
  types: [string];
  geoPoint?: firebase.firestore.GeoPoint;
}
