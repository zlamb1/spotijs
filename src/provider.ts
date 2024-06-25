import axios from 'axios';
import { APIService } from './service';
import { SpAlbum } from './model/album';
import { SpTrack } from './model/track';
import { SpArtist } from './model/artist';
import { SpCategory } from './model/category';
import { SpEpisode } from './model/episode';
import { SpPlaybackState } from './model/playback_state';
import { SpDevice } from './model/device';
import { SpShow } from './model/show';
import { SpProfile } from './model/profile';

const API_ENDPOINT = 'https://api.spotify.com/v1/';

export interface ArrayOffset {
    limit: number;
    index: number;
}

interface Request {
    method?: string;
    url: string;
    headers?: any;
    data?: any;
}

export interface NetworkConsumer {
    apiService: APIService; 

    consume: (req: Request) => any;
}

export class AxiosConsumer implements NetworkConsumer {
    apiService: APIService;

    constructor(api_service: APIService) {
        this.apiService = api_service; 
        axios.interceptors.request.use(function (config) {
            // @ts-ignore
            if (api_service.authToken?.accessToken && config.attachAuth) {
                config?.headers?.setAuthorization(`Bearer ${api_service.authToken?.accessToken}`);
            }
            
            return config; 
        });
    }

    async consume(req: Request) {
        // @ts-ignore
        return axios({...req, attachAuth: true});
    }
}

export class APIProvider {
    networkConsumer: NetworkConsumer;

    constructor(networkConsumer: NetworkConsumer) {
        this.networkConsumer = networkConsumer;
    }

    async getUserProfile() : Promise<SpProfile | undefined> {
        const res = await this.networkConsumer.consume({
            url: API_ENDPOINT + 'me'
        });
        
        if (!res.data) return undefined;
        return new SpProfile(res.data);
    }
}