import { SpAlbum } from "./album";
import { SpArtist } from "./artist";

export class SpTrack {
    album?: SpAlbum;
    artists: SpArtist[];
    markets: string[];
    disc_number: number;
    duration: number; 
    explicit: boolean;
    id: string;
    is_playable: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    is_local: boolean;

    constructor(data: any) {
        if (data.album) this.album = new SpAlbum(data.album); 
        this.artists = data.artists.map((artist: any) => new SpArtist(artist));
        this.markets = data.available_markets;
        this.disc_number = data.disc_number;
        this.duration = data.duration_ms;
        this.explicit = data.explicit;
        this.id = data.id;
        this.is_playable = data.is_playable;
        this.name = data.name;
        this.popularity = data.popularity;
        this.preview_url = data.preview_url;
        this.track_number = data.track_number;
        this.is_local = data.is_local;
    }
}