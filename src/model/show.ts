import { SpEpisode } from "./episode";
import { SpImage } from "./image";

export class SpShow {
    markets: string[];
    copyrights: string[];
    description: string;
    explicit: boolean;
    id: string;
    images: SpImage[];
    is_externally_hosted: boolean;
    languages: string[];
    media_type: string;
    name: string;
    publisher: string;
    episode_count: number;
    episodes?: SpEpisode[];

    constructor(data: any) {
        this.markets = data.available_markets;
        this.copyrights = data.copyrights.map((copyright: any) => copyright.text);
        this.description = data.description;
        this.explicit = data.explicit;
        this.id = data.id;
        this.images = data.images.map((img: any) => img as SpImage);
        this.is_externally_hosted = data.is_externally_hosted;
        this.languages = data.language;
        this.media_type = data.media_type;
        this.name = data.name;
        this.publisher = data.publisher;
        this.episode_count = data.episode_count;
        this.episodes = data.episodes?.map((episode: any) => new SpEpisode(episode));
    }
}