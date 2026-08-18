export function LocalStorage() {
  return {
    getItem<T = any>(key: string): T | null {
      try {
        const item = window.localStorage.getItem(key);
        if (!item) return null;
        try {
          return JSON.parse(item) as T;
        } catch {
          return item as unknown as T;
        }
      } catch (error) {
        console.error(`Error getting item ${key} from localStorage`, error);
        return null;
      }
    },
    setItem(key: string, value: any): void {
      try {
        const val = typeof value === "string" ? value : JSON.stringify(value);
        window.localStorage.setItem(key, val);
      } catch (error) {
        console.error(`Error setting item ${key} in localStorage`, error);
      }
    },
    removeItem(key: string): void {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing item ${key} from localStorage`, error);
      }
    },
    clear(): void {
      try {
        window.localStorage.clear();
      } catch (error) {
        console.error("Error clearing localStorage", error);
      }
    },
  };
}

export default LocalStorage;
