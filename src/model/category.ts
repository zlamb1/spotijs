import { SpImage } from "./image";

export class SpCategory {
    icons: SpImage[];
    id: string;
    name: string;

    constructor(data: any) { 
        this.icons = data.icons.map((icon: any) => icon as SpImage);
        this.id = data.id;
        this.name = data.name; 
    }
}