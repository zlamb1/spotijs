import { SpDevice } from "./device";
import { SpParse } from "./types";

export class SpPlaybackState {
    device: SpDevice;
    repeat_state: string;
    shuffle_state: boolean;
    // TODO: create model
    context: any;
    timestamp: number;
    progress: number;
    is_playing: boolean;
    // TODO: create model
    item: any;
    playing_type: any;
    actions: any[];

    constructor(data: any) {
        this.device = new SpDevice(data.device);
        this.repeat_state = SpParse.getRepeatState(data.repeat_state);
        this.shuffle_state = data.shuffle_state;
        this.context = data.context;
        this.timestamp = data.timestamp; 
        this.progress = data.progress;
        this.is_playing = data.is_playing;
        this.item = data.item;
        this.playing_type = data.playing_type;
        this.actions = data.actions; 
    }
}