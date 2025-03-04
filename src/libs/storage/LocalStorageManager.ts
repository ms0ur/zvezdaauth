import {TokenSuccessfulResponse} from "../types/types.ts";


export class LocalStorageManager {

    private access = 'access_token';
    private refresh = 'refresh_token';
    setTokens(data: TokenSuccessfulResponse) {
        localStorage.setItem(this.access, data.access_token);
        localStorage.setItem(this.refresh, data.refresh_token);
    }

    getTokens() {
        return {
            access_token: localStorage.getItem(this.access),
            refresh_token: localStorage.getItem(this.refresh)
        };
    }

    removeTokens() {
        localStorage.removeItem(this.access);
        localStorage.removeItem(this.refresh);
    }

    updateTokens(data: TokenSuccessfulResponse) {
        localStorage.setItem(this.access, data.access_token);
        localStorage.setItem(this.refresh, data.refresh_token);
    }
}