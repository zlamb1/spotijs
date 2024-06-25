import { SpImage } from "./image";
import { SpProfile } from "./profile";
import { SpTrack } from "./track";

export class SpPlaylist {
    collaborative: boolean;
    description: string;
    followers: number;
    id: string;
    images: SpImage[];
    name: string;
    owner: SpProfile;
    public: boolean;
    snapshot_id: string;
    tracks: SpTrack[];

    constructor(data: any) {
        this.collaborative = data.collaborative;
        this.description = data.description;
        this.followers = data.followers;
        this.id = data.id;
        this.images = data.images.map((img: any) => img as SpImage);
        this.name = data.name;
        this.owner = new SpProfile(data.owner);
        this.public = data.public;
        this.snapshot_id = data.snapshot_id;
        this.tracks = data.tracks.map((track: any) => new SpTrack(track));
    }
}