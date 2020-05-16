import * as _ from 'lodash';
import { IStorageSettings } from './interfaces/storage-settings';
import { StorageTypes } from './enums/storage-types';
import { StorageBase } from './base/storage-base';

/**
 * Provides basic functionality for StorageUtilities.
 */
class StorageUtilitiesBasic<T> extends StorageBase<T> {
	defaultSettings: IStorageSettings;

	constructor(settings: IStorageSettings) {
		super(settings);
		this.defaultSettings = settings;
	}

	setCustomSettings(settings: IStorageSettings): void {
		this.setSettings(settings);
	}

	resetSettings(): void {
		this.setSettings(defaultSettings);
	}

	addItem(key: string, item: T, expiry?: number, type?: StorageTypes): void {
		this.add(key, item, expiry, type);
	}

	getItem(key: string, type?: StorageTypes): T {
		return this.get(key, type);
	}

	removeItem(key: string, type?: StorageTypes): void {
		this.remove(key, type);
	}

	removeItems(keys: string[], type?: StorageTypes): void {
		this.removeAll(keys, type);
	}

	clearAll(type?: StorageTypes): void {
		this.clear(type);
	}
}

// default settings
export const defaultSettings: IStorageSettings = {
	keyPrefix: '',
	type: StorageTypes.LOCAL // set to localStorage by default
};

// create a singleton
export default new StorageUtilitiesBasic(defaultSettings);
