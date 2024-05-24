import { useEffect, useState } from "react";

export type StorageType = 'session' | 'local';

export interface StatefulStorageInterface<TElement> {
    item: TElement;
    getItem: () => TElement|null;
    setItem: (item: TElement) => void;
    removeItem: () => void;
}

export interface StatefulStorageProps {
    type: StorageType;
    key: string;
}
export function useStatefulStorage<TElement>(props: StatefulStorageProps) : StatefulStorageInterface<TElement> {
    let { type, key } = props;

    if (!type) type = "local";

    if (!key) throw new Error("Unable to initialize stateful storage without key");

    const isBrowser: boolean = ((): boolean => typeof window != 'undefined')();
    const storageApi: Storage = isBrowser ? window[`${type ?? 'local'}Storage`] : null;

    const EMPTY = "";

    const getItemInternal = (): string => storageApi?.getItem(key) || EMPTY;
    const setItemInternal = (value: string): void => storageApi?.setItem(key, value);
    const removeItemInternal = () => storageApi?.removeItem(key);

    const [ storedValue, setStoredValue ] = useState<{ obj: TElement, str: string }>({
        obj: getItem(),
        str: getItemInternal(),
    });

    // attach event listeners
    useEffect(() => {

        if (isBrowser) {
            window.onstorage = onStorage;

            return () => window.onstorage = null;
        }
    }, [ isBrowser ]);

    function onStorage(e: StorageEvent) {
        if (e.key == key) {
            console.log("Received filtered storage event", e);
            setValue(e.newValue);
        }
    }

    function setValue(str: string) {
        if (str != storedValue.str) {
            const obj = convertItem(str);

            setStoredValue({
                obj: obj,
                str: str || EMPTY
            });

        }
    }

    function setItem(value: TElement) {
        const str = value == null ? EMPTY : JSON.stringify(value);
        setValue(str);
        if (str) {
            setItemInternal(str);
        } else {
            removeItemInternal();
        }
    }

    function removeItem() {
        setValue(EMPTY);
        removeItemInternal();
        // setItemInternal(EMPTY);
    }

    function getItem(): TElement {
        const str = getItemInternal();

        return convertItem(str);
    }

    function convertItem(str: string) {
        let value: TElement = null;
        if (str) {
            value = JSON.parse(str);
        }

        return value;
    }

    return {
        item: storedValue?.obj,
        getItem: (): TElement => storedValue?.obj,
        setItem,
        removeItem,
    };
}
