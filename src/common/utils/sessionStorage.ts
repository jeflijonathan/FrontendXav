export function SessionStorage() {
    const setItem = <T>(key: string, value: T): void => {
        if (typeof window != undefined) {
            window.sessionStorage.setItem(key, JSON.stringify(value));
        }
    }

    const getItem = <T>(key: string, initialValue: T): T => {
        if (typeof window != undefined) {
            const item = window.sessionStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        }
        return initialValue;
    }

    const removeItem = (key: string): void => {
        if (typeof window != undefined) {
            window.sessionStorage.removeItem(key);
        }
    }

    const clear = (): void => {
        if (typeof window != undefined) {
            window.sessionStorage.clear();
        }
    }

    return {
        setItem, getItem, removeItem, clear
    };
}

export default SessionStorage;