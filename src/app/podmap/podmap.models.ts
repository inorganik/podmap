import { AngularFirestoreCollection } from 'angularfire2/firestore';

export interface Podcast {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl60: string;
  artworkUrl100: string;
}

export interface PodcastLocation {
  name: string;
  geoPoint: any;
  placeId: string;
  podCount: number;
  podcasts: AngularFirestoreCollection<Podcast>;
}

export enum SuggestionStatus {
  Unmoderated,
  Approved,
  Rejected
}

export interface PodcastSuggestion extends Podcast {
  locationName?: string;
  placeId?: string;
  geoPoint?: any;
  status?: SuggestionStatus;
}
