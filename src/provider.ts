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
import { SpPlaylist } from './model/playlist';

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
            // @ts-ignore
            if (config.attachEndpoint) {
                config.url = API_ENDPOINT + config?.url;
            }
            return config; 
        });
    }

    async consume(req: Request) {
        // @ts-ignore
        return axios({...req, attachAuth: true, attachEndpoint: true});
    }
}

export class APIProvider {
    networkConsumer: NetworkConsumer;

    constructor(networkConsumer: NetworkConsumer) {
        this.networkConsumer = networkConsumer;
    }

    parseResponse(data: any, func: (data: any) => any) {
        if (data) {
            return func(data); 
        }
    }

    createCSVFromArray(array: string[]) : string {
        let str = '';
        array.forEach((element, index) => str += element + (index != array.length - 1 ? ',' : ''));
        return str; 
    }

    async getUserProfile() : Promise<SpProfile | undefined> {
        const res = await this.networkConsumer.consume({
            url: 'me'
        });

        return this.parseResponse(res.data, (data) => new SpProfile(data));
    }

    async getUserTopItems(type: 'artists' | 'tracks', time_range?: string, offset: ArrayOffset = { limit: 50, index: 0 }) : Promise<SpArtist[] | SpTrack[] | undefined> {
        const res = await this.networkConsumer.consume({
            url: 'me/top',
            data: {
                type: type,
                time_range: time_range,
                limit: offset.limit,
                offset: offset.index
            }
        });

        return this.parseResponse(res.data, (data) => data.map((item: any) => type == 'artists' ? new SpArtist(item) : new SpTrack(item)));
    }

    async getProfile(user_id: string) : Promise<SpProfile | undefined> {
        const res = await this.networkConsumer.consume({
            url: 'users',
            data: {
                user_id: user_id
            }
        });

        return this.parseResponse(res.data, (data) => new SpProfile(data));
    }

    async followPlaylist(playlist: SpPlaylist, is_public: boolean = true) : Promise<void> {
        await this.networkConsumer.consume({
            method: 'put',
            url: `playlists/${playlist.id}/followers`
        });
    }

    async unfollowPlaylist(playlist: SpPlaylist) : Promise<void> {
        await this.networkConsumer.consume({
            method: 'delete',
            url: `playlists/${playlist.id}/followers`
        });
    }

    async getFollowedArtists(after?: string, limit: number = 50) : Promise<void> {
        const res = await this.networkConsumer.consume({
            url: 'me/following',
            data: {
                after: after,
                limit: limit
            }
        });

        return this.parseResponse(res.data, (data) => data.artists.items.map((artist: any) => new SpArtist(artist))); 
    }

    async followArtistsOrUsers(type: 'artist' | 'user', ids: string[]) : Promise<void> {
        await this.networkConsumer.consume({
            method: 'put',
            url: 'me/following',
            data: {
                type: type,
                ids: this.createCSVFromArray(ids)
            }
        })
    }

    async unfollowArtistsOrUsers(type: 'artist' | 'user', ids: string[]) : Promise<void> {
        await this.networkConsumer.consume({
            method: 'delete',
            url: 'me/following',
            data: {
                type: type,
                ids: this.createCSVFromArray(ids)
            }
        })
    }

    async checkIfUserFollowsArtistOrUser(type: 'artist' | 'user', ids: string[]) : Promise<boolean | undefined> {
        const res = await this.networkConsumer.consume({
            url: 'me/following/contains',
            data: {
                type: type,
                ids: this.createCSVFromArray(ids)
            }
        });
        
        return res.data; 
    }

    async checkIfUserFollowsPlaylist(playlist: SpPlaylist) : Promise<boolean | undefined> {
        const res = await this.networkConsumer.consume({
            url: `playlists/${playlist.id}/followers/contain`,
        });

        return res.data;
    }
}