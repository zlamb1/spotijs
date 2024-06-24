export enum AuthScope {
    All = 'all',
    None = '',

    ImageUpload = 'ugc-image-upload',
    ReadPlaybackState = 'user-read-playback-state',
    ModifyPlaybackState = 'user-modify-playback-state',
    ReadCurrentlyPlaying = 'user-read-currently-playing',
    AppRemoteControl = 'app-remote-control',
    Streaming = 'streaming', 
    PlaylistReadPrivate = 'playlist-read-private', 
    PlaylistReadCollaborative = 'playlist-read-collaborative',
    PlaylistModifyPrivate = 'playlist-modify-private',
    PlaylistModifyPublic = 'playlist-modify-public', 
    UserFollowModify = 'user-follow-modify',
    UserFollowRead = 'user-follow-read',
    UserReadPlaybackPosition = 'user-read-playback-position',
    UserTopRead = 'user-top-read',
    UserReadRecentlyPlayed = 'user-read-recently-played',
    UserLibraryModify = 'user-library-modify',
    UserLibraryRead = 'user-library-read',
    UserReadEmail = 'user-read-email',
    UserReadPrivate = 'user-read-private',
    UserSoaLink = 'user-soa-link',
    UserSoaUnlink = 'user-soa-unlink',
    SoaManageEntitlements = 'soa-manage-entitlements',
    SoaManagePartner = 'soa-manage-partner',
    SoaCreatePartner = 'soa-create-partner',
}

export namespace Scope {
    export function asString(scope: AuthScope) : string;
    export function asString(scope: AuthScope[]) : string;

    export function asString(scope: AuthScope | AuthScope[]) : string {
        const mapAllScopes = () => {
            let str = ''; 
            const keys = Object.keys(AuthScope);
            keys.forEach((key, index) => {
                switch (key) {
                    case AuthScope.All:
                        break;
                    default:
                        str += key; 
                }

                if (index != keys.length - 1) {
                    str += ' '; 
                }
            });
            return str;
        }

        if (scope instanceof Array) {
            let str = ''; 
            for (let i = 0; i < scope.length; i++) {
                if (scope[i] == AuthScope.All) {
                    str += mapAllScopes();
                } else {
                    str += scope[i]; 
                }
            }

            return str; 
        } else {
            if (scope == AuthScope.All) {
                return mapAllScopes(); 
            } else {
                return scope; 
            }
        }
    }
}