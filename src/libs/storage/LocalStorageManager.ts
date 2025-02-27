/**
 * Класс для управления данными в localStorage
 */
export class LocalStorageManager {

    /**
     * Сохраняет значение в localStorage
     */
    set<T>(key: string, value: T): void {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('Ошибка при сохранении в localStorage:', error);
        }
    }

    /**
     * Получает значение из localStorage
     */
    get<T>(key: string, defaultValue: T | null = null): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Ошибка при получении из localStorage:', error);
            return defaultValue;
        }
    }

    /**
     * Удаляет значение из localStorage
     */
    remove(key: string): void {
        localStorage.removeItem(key);
    }

    /**
     * Проверяет существование ключа в localStorage
     */
    has(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }
}