import { SpImage } from "./image";
import { SpShow } from "./show";

export class SpEpisode {
    preview_url: string;
    description: string;
    duration: number;
    explicit: boolean;
    id: string;
    images: SpImage[];
    is_externally_hosted: boolean;
    is_playable: boolean;
    language: string;
    languages: string[];
    name: string;
    release_date: string;
    show?: SpShow;

    constructor(data: any) {
        this.preview_url = data.audio_preview_url;
        this.description = data.description;
        this.duration = data.duration_ms;
        this.explicit = data.explicit;
        this.id = data.id;
        this.images = data.images.map((img: any) => img as SpImage);
        this.is_externally_hosted = data.is_externally_hosted;
        this.is_playable = data.is_playable;
        this.language = data.language;
        this.languages = data.languages;
        this.name = data.name; 
        this.release_date = data.release_date;
        this.show = data.show; 
    }
}