import * as _ from 'lodash';
import { IStorageOperations } from './modules/interfaces/storage-operations';
import { IStorageSettings } from './modules/interfaces/storage-settings';
import { StorageTypes } from './modules/enums/storage-types';
import { StorageItem } from './modules/models/storage-item';
import { StorageBase } from './modules/base/storage-base';


class StorageUtilitiesBase<T> extends StorageBase<T> implements IStorageOperations<T> {
    defaultSettings: IStorageSettings;

	constructor(settings: IStorageSettings) {
        super(settings);
        this.defaultSettings = settings
    }

    setCustomSettings(settings: IStorageSettings): void {
        this.setSettings(settings);
    }
    
    resetSettings(): void {
        this.setSettings(defaultSettings);
    }
    
    addItem(key: string, item: T): void {
        this.add(key, item);
    }

    getItem(key: string): T {
        return this.get(key);
    }

    removeItem(key: string): void {
        this.remove(key);
    }

    removeAll(keys: string[]): void {
        throw new Error("Method not implemented.");
    }

    clear(): void {
        throw new Error("Method not implemented.");
    }

    findOne(key: string, id: string): T {
        throw new Error("Method not implemented.");
    }

    findAll(key: string): T[] {
        throw new Error("Method not implemented.");
    }

    findAllItems(): StorageItem<T>[] {
        throw new Error("Method not implemented.");
    }

    findAllValues(): T[] {
        throw new Error("Method not implemented.");
    }

    findAllKeys(): string[] {
        throw new Error("Method not implemented.");
    }

    addOne(key: string, item: T): void {
        throw new Error("Method not implemented.");
    }

    addAll(key: string, items: T[]): void {
        throw new Error("Method not implemented.");
    }

    removeOne(key: string, id: string): void {
        throw new Error("Method not implemented.");
    }

}

// default settings
const defaultSettings: IStorageSettings = {
    keyPrefix: '',
    type: StorageTypes.SESSION // set to sessionStorage by default
};

// create a singleton
export default new StorageUtilitiesBase(defaultSettings);
