export function SessionStorage() {
    return {
        getItem<T = any>(key: string): T | null {
            try {
                const item = window.sessionStorage.getItem(key);
                if (!item) return null;
                try {
                    return JSON.parse(item) as T;
                } catch {
                    return item as unknown as T;
                }
            } catch (error) {
                console.error(`Error getting item ${key} from sessionStorage`, error);
                return null;
            }
        },
        setItem(key: string, value: any): void {
            try {
                const val = typeof value === "string" ? value : JSON.stringify(value);
                window.sessionStorage.setItem(key, val);
            } catch (error) {
                console.error(`Error setting item ${key} in sessionStorage`, error);
            }
        },
        removeItem(key: string): void {
            try {
                window.sessionStorage.removeItem(key);
            } catch (error) {
                console.error(`Error removing item ${key} from sessionStorage`, error);
            }
        },
        clear(): void {
            try {
                window.sessionStorage.clear();
            } catch (error) {
                console.error("Error clearing sessionStorage", error);
            }
        },
    };
}

export default SessionStorage;