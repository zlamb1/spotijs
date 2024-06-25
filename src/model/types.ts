export enum SpType {
    Track = 'track',
    Episode = 'episode',
    Unknown = 'unknown'
}

export enum SpDeviceType {
    Computer = 'computer',
    Smartphone = 'smartphone',
    Speaker = 'speaker',
    Unknown = 'unknown'
}

export enum SpRepeatState {
    Off = 'off',
    Track = 'track',
    Context = 'context',
    Unknown = 'unknown'
}

export enum SpAlbumType {
    Album = 'album',
    Single = 'single',
    Compilation = 'compilation',
    Unknown = 'unknown'
}

export namespace SpParse {
    export function getItemType(type: string) : SpType {
        switch (type?.toLowerCase()) {
            case 'track':
                return SpType.Track;
            case 'episode':
                return SpType.Episode;
            default:
                return SpType.Unknown;
        }
    }

    export function getDeviceType(type: string) : SpDeviceType {
        switch (type?.toLowerCase()) {
            case 'computer':
                return SpDeviceType.Computer;
            case 'smartphone':
                return SpDeviceType.Smartphone;
            case 'speaker':
                return SpDeviceType.Speaker;
            default: 
                return SpDeviceType.Unknown; 
        }
    }

    export function getRepeatState(state: string) : SpRepeatState {
        switch (state?.toLowerCase()) {
            case 'off':
                return SpRepeatState.Off;
            case 'track':
                return SpRepeatState.Track;
            case 'context':
                return SpRepeatState.Context;
            default:
                return SpRepeatState.Unknown;
        }
    }

    export function getAlbumType(type: string) : SpAlbumType {
        switch (type?.toLowerCase()) {
            case 'album':
                return SpAlbumType.Album;
            case 'single':
                return SpAlbumType.Single;
            case 'compilation':
                return SpAlbumType.Compilation;
            default:
                return SpAlbumType.Unknown; 
        }
    }
}