import { SpContext } from "./context";
import { SpDevice } from "./device";
import { SpEpisode } from "./episode";
import { SpPlaybackActions } from "./playback_actions";
import { SpTrack } from "./track";
import { SpParse, SpType } from "./types";

export class SpPlaybackState {
    device: SpDevice;
    repeat_state: string;
    shuffle_state: boolean;
    context: SpContext;
    timestamp: number;
    progress: number;
    is_playing: boolean;
    playing_type: SpType;
    item?: SpTrack | SpEpisode;
    actions: SpPlaybackActions;

    constructor(data: any) {
        this.device = new SpDevice(data.device);
        this.repeat_state = SpParse.getRepeatState(data.repeat_state);
        this.shuffle_state = data.shuffle_state;
        this.context = new SpContext(data.context);
        this.timestamp = data.timestamp; 
        this.progress = data.progress_ms;
        this.is_playing = data.is_playing;
        this.playing_type = SpParse.getItemType(data.playing_type);
        switch (this.playing_type) {
            case SpType.Track:
                this.item = new SpTrack(data.item);
            case SpType.Episode:
                this.item = new SpEpisode(data.item); 
            default:
                this.item = undefined;
        }
        this.actions = data.actions as SpPlaybackActions; 
    }
}