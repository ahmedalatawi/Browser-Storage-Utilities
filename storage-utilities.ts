import { IStorageSettings } from "./modules/interfaces/storage-settings";
import StorageUtilitiesBase from './storage-utilities-base';

export class StorageUtilities<T> {
    private static _settings: IStorageSettings;

    constructor(settings?: IStorageSettings) {
        StorageUtilities._settings = {
            ...StorageUtilitiesBase.defaultSettings,
            ...settings
        }
        if (settings) {
            // console.log('settings ', StorageUtilities._settings);
            StorageUtilitiesBase.setCustomSettings(StorageUtilities._settings);
        }
    }

    static set customSettings(settings: IStorageSettings) {
        StorageUtilitiesBase.setCustomSettings(settings);
    }

    static resetSettings(): void {
        StorageUtilitiesBase.resetSettings();
    }

    static get defaultSettings(): IStorageSettings {
        return StorageUtilitiesBase.defaultSettings;
    }

    static get currentSettings(): IStorageSettings {
        return this._settings;
    }
    
    protected findOne(key: string, id: string): T {
        return StorageUtilitiesBase.findOne(key, id) as T;
    }

    protected getItem(key: string): T {
        return StorageUtilitiesBase.getItem(key) as T;
    }

    protected findAll(key: string): T[] {
        return StorageUtilitiesBase.findAll(key) as T[];
    }

    protected addItem(key: string, item: T): void {
        StorageUtilitiesBase.addItem(key, item);
    }

    protected removeItem(key: string): void {
        StorageUtilitiesBase.removeItem(key);
    }

    protected saveAll(key: string, items: T[]): void {
        StorageUtilitiesBase.addAll(key, items);
    }

    protected removeOne(key: string, id: string): void {
        StorageUtilitiesBase.removeOne(key, id);
    }

    protected clearOne(key: string): void {
        StorageUtilitiesBase.removeItem(key);
    }

    protected clearAll(): void {
        StorageUtilitiesBase.clear();
    }
}