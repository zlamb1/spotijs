export class SpArtist {
    followers: number;
    genres: string[];
    id: string;
    images: any[];
    name: string;
    /* Ranges between 0 and 100 based on track popularity */
    popularitiy: number;

    constructor(data: any) {
        this.followers = data.followers.total; 
        this.genres = data.genres;
        this.id = data.id;
        this.images = data.images;
        this.name = data.name;
        this.popularitiy = data.popularitiy;
    }
}