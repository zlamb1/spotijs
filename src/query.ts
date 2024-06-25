import axios from 'axios';
import { APIService } from './service';

const API_ENDPOINT = 'https://api.spotify.com/v1/';

export interface APIProvider {
    apiService: APIService,
    albums: {
        getAlbum: () => void,
        getSeveralAlbums: () => void,
        getAlbumTracks: () => void,
        getSavedAlbums: () => void,
        saveAlbums: () => void,
        removeSavedAlbums: () => void,
        checkSavedAlbums: () => void,
        getNewReleases: () => void
    },
    artists: {
        getArtist: () => void,
        getSeveralArtists: () => void,
        getArtistAlbums: () => void,
        getArtistTopTracks: () => void,
        getArtistRelatedTracks: () => void
    },
    audiobooks: {
        getAudiobook: () => void,
        getSeveralAudiobooks: () => void,
        getAudiobookChapters: () => void,
        getSavedAudiobooks: () => void,
        saveAudiobooks: () => void,
        removeSavedAudibooks: () => void,
        checkSavedAudiobooks: () => void
    }, 
    categories: {
        getCategory: () => void,
        getSeveralCategories: () => void
    },
    chapters: {
        getChapter: () => void,
        getSeveralChapters: () => void,
    },
    episodes: {
        getEpisode: () => void,
        getSeveralEpisodes: () => void,
        getSavedEpisodes: () => void,
        saveEpisodes: () => void,
        removeSavedEpisodes: () => void,
        checkSavedEpisodes: () => void
    },
    genres: {
        getGenreSeeds: () => void
    },
    markets: {
        getMarkets: () => void
    },
    player: {
        getPlaybackState: () => void,
        transferPlayback: () => void,
        getDevices: () => void,
        getCurrentTrack: () => void,
        resumePlayback: () => void,
        pausePlayback: () => void,
        skipToNext: () => void,
        skipToPrevious: () => void,
        seekToPosition: () => void,
        setRepeatMode: () => void,
        setVolume: () => void,
        toggleShuffle: () => void,
        getRecentTracks: () => void,
        getQueue: () => void,
        addQueueItem: () => void
    },
    playlists: {
        getPlaylist: () => void,
        changePlaylistDetails: () => void,
        getPlaylistItems: () => void,
        updatePlaylistItems: () => void,
        addPlaylistItems: () => void,
        removePlaylistItems: () => void,
        getUserPlaylists: () => void,
        createPlaylist: () => void,
        getFeaturedPlaylists: () => void,
        getCategoryPlaylists: () => void,
        getPlaylistCover: () => void,
        addCustomPlaylistCover: () => void
    },
    search: {
        search: () => void
    },
    shows: {
        getShow: () => void,
        getSeveralShows: () => void,
        getShowEpisodes: () => void,
        getSavedShows: () => void,
        saveShows: () => void,
        removeSavedShows: () => void,
        checkSavedShows: () => void,
    },
    tracks: {
        getTracks: () => void,
        getSeveralTracks: () => void,
        getSavedTracks: () => void,
        saveTracks: () => void,
        removeSavedTracks: () => void,
        checkSavedTracks: () => void,
        getTrackAudioFeatures: () => void,
        getSeveralTrackAudioFeatures: () => void,
        getTrackAudioAnalysis: () => void,
        getRecommendations: () => void,
    },
    users: {
        getUserProfile: () => void,
        getUserTopItems: () => void,
        getProfile: () => void,
        followPlaylist: () => void,
        unfollowPlaylist: () => void,
        getFollowedArtists: () => void,
        followArtistsOrUsers: () => void,
        unfollowArtistsOrUsers: () => void,
        checkIfUserFollowsArtistsOrUsers: () => void,
        checkIfCurrentUserFollowsPlaylist: () => void
    }
}

export class AxiosProvider implements Partial<APIProvider> {
    apiService: APIService;
    constructor(apiService: APIService) {
        this.apiService = apiService; 
    }
}