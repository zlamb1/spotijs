import { SpArtist } from "./artist";
import { SpImage } from "./image";
import { SpTrack } from "./track";
import { SpAlbumType, SpParse } from "./types";

export class SpAlbum {
    type: SpAlbumType;
    track_count: number;
    markets: string[];
    id: string;
    images: SpImage[];
    name: string;
    // TODO: convert to using Date?
    release_date: string;
    artists: SpArtist[];
    tracks?: SpTrack[];
    copyrights: any[];
    genres: string[]; 
    label: string;
    /* Ranges between 0 and 100 */
    popularity: number;

    constructor(data: any) {
        this.type = SpParse.getAlbumType(data.album_type);
        this.track_count = data.total_tracks;
        this.markets = data.available_markets;
        this.id = data.id;
        this.images = data.images.map((img: any) => img as SpImage);
        this.name = data.name;
        this.release_date = data.release_date; 
        this.artists = data.artists.map((artist: any) => new SpArtist(artist));
        this.tracks = data.tracks?.map((track: any) => new SpTrack(track));
        this.copyrights = data.copyrights;
        this.genres = data.genres;
        this.label = data.label;
        this.popularity = data.popularity; 
    }
}