export interface Categories {
  [key: string]: Boolean;
}

export interface Podcast {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl30: string;
  artworkUrl60: string;
  artworkUrl100: string;
  feedUrl: string;
  itunesSub: string;
  placeIds?: Categories;
  locations?: PodcastLocation[];
  // it's very cumbersome to look up each location by place id
  // much simpler to just include locations
}

export interface PodcastLocation {
  description: string;
  // storing root-level lat/lng allows for better querying
  lat: number;
  lng: number;
  placeId: string;
  podCount?: number;
}

export enum SuggestionStatus {
  Unmoderated,
  Approved,
  Rejected
}

export interface PodcastSuggestion {
  id?: string;
  podcast: Podcast;
  status?: SuggestionStatus;
}

// a munging of Autocomplete and Place service results
export interface Place {
  description: string;
  matched_substrings?: [any];
  place_id: string;
  terms: [any];
  types: [string];
}

export interface MetaCounts {
  podcastCount: number;
  locationCount: number;
}
