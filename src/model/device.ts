import { SpDeviceType, SpParse } from "./types";

export class SpDevice {
    id: string;
    is_active: boolean;
    is_private_session: boolean;
    is_restricted: boolean;
    name: string;
    type: SpDeviceType;
    volume: number;
    supports_volume: boolean;

    constructor(data: any) {
        this.id = data.id;
        this.is_active = data.is_active;
        this.is_private_session = data.is_private_session; 
        this.is_restricted = data.is_restricted;
        this.name = data.name; 
        this.type = SpParse.getDeviceType(data.type);
        this.volume = data.volume_percent;
        this.supports_volume = data.supports_volume; 
    }
}