import { SpContextType, SpParse } from "./types";

export class SpContext {
    type: SpContextType;
    uri: string;

    constructor(data: any) {
        this.type = SpParse.getContextType(data.type);
        this.uri = data.uri;
    }
}