type StorageType = 'session' | 'local';
type UseStorageReturnValue = {
    getItem: (key: string, type?: StorageType) => string;
    setItem: (key: string, value: string, type?: StorageType) => boolean;
    removeItem: (key: string, type?: StorageType) => void;
    clearStorageItemsWithPrefix: (prefix: string, type?: StorageType) => void;
};

const useStorage = (): UseStorageReturnValue => {
    const storageType = (type?: StorageType): 'localStorage' | 'sessionStorage' => `${type ?? 'local'}Storage`;

    const isBrowser: boolean = ((): boolean => typeof window != 'undefined')();

    const getItem = (key: string, type?: StorageType): string => {
        return isBrowser ? window[storageType(type)][key] : '';
    };

    const setItem = (key: string, value: string, type?: StorageType): boolean => {
        if (isBrowser) {
            window[storageType(type)].setItem(key, value);
            return true;
        }

        return false;
    };

    const removeItem = (key: string, type?: StorageType): void => {
        window[storageType(type)].removeItem(key);
    };

    const clearStorageItemsWithPrefix = (prefix: string, type?: StorageType) => {

        for (let i = 0; i < window[storageType(type)].length; i++) {
            const key = window[storageType(type)].key(i);

            if (key && key.startsWith(prefix)) {
                window[storageType(type)].removeItem(key);
                i--;
            }
        }
    }

    return {
        getItem,
        setItem,
        removeItem,
        clearStorageItemsWithPrefix,
    };
};

export default useStorage;
