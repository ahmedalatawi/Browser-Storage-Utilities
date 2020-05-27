import * as _ from 'lodash';
import { IStorageSettings } from './interfaces/storage-settings';
import { StorageTypes } from './enums/storage-types';
import { StorageBase } from './base/storage-base';
import { Observable } from 'rxjs';
import { IStorageNotifier } from './interfaces/storage-typings';
import { StorageItem } from './models/storage-item';
import { IStorageGeneralOperations, IStorageCollectionOperations } from './interfaces/storage-operations';

/**
 * Provides base functionality for StorageUtilities.
 */
class StorageUtilitiesBase<T> extends StorageBase<T> implements IStorageGeneralOperations<T>, IStorageCollectionOperations<T> {
	defaultSettings: IStorageSettings;

	constructor(settings: IStorageSettings) {
		super(settings);
		this.defaultSettings = settings;
	}

	/**
	 * 
	 * @param settings 
	 */
	setCustomSettings(settings: IStorageSettings): void {
		this.setSettings(settings);
	}

	/**
	 * 
	 */
	resetSettings(): void {
		this.setSettings(defaultSettings);
	}

	/**
	 * 
	 * @param key 
	 * @param item 
	 * @param expiry 
	 * @param type 
	 */
	addItem(key: string, item: T, expiry?: number, type?: StorageTypes): void {
		this.add(key, item, expiry, type);
	}

	/**
	 * 
	 * @param key 
	 * @param type 
	 */
	getItem(key: string, type?: StorageTypes): T {
		return this.get(key, type);
	}

	/**
	 * 
	 * @param key 
	 * @param type 
	 */
	removeItem(key: string, type?: StorageTypes): void {
		this.remove(key, type);
	}

	/**
	 * 
	 * @param keys 
	 * @param type 
	 */
	removeItems(keys: string[], type?: StorageTypes): void {
		this.removeAll(keys, type);
	}

	/**
	 * 
	 * @param key 
	 * @param propName 
	 * @param newValue 
	 * @param type 
	 */
	updateItemProp(key: string, propName: string, newValue: any, type?: StorageTypes): T {
		return this.updateProp(key, propName, newValue, type);
	}

	/**
	 * 
	 * @param key 
	 * @param propName 
	 * @param type 
	 */
	removeItemProp(key: string, propName: string, type?: StorageTypes): T {
		return this.removeProp(key, propName, type);
	}

	/**
	 * 
	 * @param type 
	 */
	clearAll(type?: StorageTypes): void {
		this.clear(type);
	}

	/**
	 * 
	 */
	getStateObservable(): Observable<IStorageNotifier<T>> {
		return this.getNotifierObservable();
	}

	/**
	 * 
	 * @param type 
	 */
	getItems(type?: StorageTypes): StorageItem<T>[] {
		const items = new Array<StorageItem<T>>();
		const storage = this.getStorage(type);
		for (let i = 0; i < storage.length; i++) {
			const key = storage.key(i);
			const json = storage.getItem(key);
			const obj = this._parsedJSON(json);
			const item = obj ? obj : json;

			items.push(
				new StorageItem<T>({
					key,
					value: item.value || item,
					expiry: item.expiry 
				})
			);
		}
		return items;
	}

	/**
	 * 
	 * @param type 
	 */
	getValues(type?: StorageTypes): T[] {
		const values = new Array<T>();
		const storage = this.getStorage(type);
		for (let i = 0; i < storage.length; i++) {
			const key = storage.key(i);
			const json = storage.getItem(key);
			const obj = this._parsedJSON(json);
			const item = obj ? obj : json;

			values.push(item.value || item);
		}
		return values;
	}

	/**
	 * 
	 * @param type 
	 */
	getKeys(type?: StorageTypes): string[] {
		const keys = new Array<string>();
		const storage = this.getStorage(type);
		for (let i = 0; i < storage.length; i++) {
			keys.push(storage.key(i));
		}
		return keys;
	}

	/**
	 * 
	 * @param key 
	 * @param id 
	 */
	findOne(key: string, id: string): T {
		// TODO: add implementation to return a single item from an Array
		return {} as any;
	}

	/**
	 * 
	 * @param key 
	 */
	findAll(key: string): T[] {
		// TODO: add implementation to return all Array items by key
		return [];
	}

	/**
	 * 
	 * @param key 
	 * @param item 
	 */
	addOne(key: string, item: T): void {
		// TODO: add implementation to add an item to Array
	}

	/**
	 * 
	 * @param key 
	 * @param items 
	 */
	addAll(key: string, items: T[]): void {
		// TODO: add implementation to add all items to Array
	}

	/**
	 * 
	 * @param key 
	 * @param id 
	 */
	removeOne(key: string, id: string): void {
		// TODO: add implementation to remove item from Array
	}

	/**
	 * 
	 * @param key 
	 */
	reset(key: string): void {
		// TODO: add implementation to reset Array
	}

	private _parsedJSON(json): any {
		try {
			const obj = JSON.parse(json);
			if (_.isObject(obj)) {
				return obj;
			}
		}
		catch (e) { }
	
		return false;
	}
}

// default settings
export const defaultSettings: IStorageSettings = {
	keyPrefix: '',
	type: StorageTypes.LOCAL // set to localStorage by default
};

// create a singleton
export default new StorageUtilitiesBase(defaultSettings);
