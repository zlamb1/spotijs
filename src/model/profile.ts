import { SpImage } from "./image";

export class SpProfile {
    country: string;
    display_name: string;
    email: string;
    followers: number;
    id: string;
    images: SpImage[];
    product: string;

    constructor(data: any) {
        this.country = data.country;
        this.display_name = data.display_name;
        this.email = data.email;
        this.followers = data.followers.total;
        this.id = data.id;
        this.images = data.images.map((img: any) => img as SpImage);
        this.product = data.product;
    }
}