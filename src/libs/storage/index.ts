import { LocalStorageManager } from './LocalStorageManager';


export const storage = new LocalStorageManager();

// Константы для ключей
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
} as const; 