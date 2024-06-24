export interface StorageCache {
    hasItem: (location: string) => boolean; 
    getItem: (location: string) => string | null; 
    setItem: (location: string, value: any) => void; 
    removeItem: (location: string) => void;
}

export class LocalStorageCache implements StorageCache {
    hasItem(location: string) : boolean {
        return this.getItem(location) != null; 
    }
    getItem(location: string) : string | null {
        return localStorage.getItem(location); 
    }
    setItem(location: string, value: any) {
        localStorage.setItem(location, value); 
    }
    removeItem(location: string) {
        localStorage.removeItem(location);
    }
}

export class SessionStorageCache implements StorageCache {
    hasItem(location: string) : boolean {
        return this.getItem(location) != null; 
    }
    getItem(location: string) : string | null {
        return sessionStorage.getItem(location); 
    }
    setItem(location: string, value: any) {
        sessionStorage.setItem(location, value); 
    }
    removeItem(location: string) {
        sessionStorage.removeItem(location);
    }
}