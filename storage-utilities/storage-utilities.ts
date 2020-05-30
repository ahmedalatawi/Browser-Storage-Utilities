import * as _ from 'lodash';
import { IStorageSettings } from './interfaces/storage-settings';
import { StorageReturnTypes } from './enums/storage-return-types';
import { StorageItem } from './models/storage-item';
import { of, Observable } from 'rxjs';

import StorageUtilitiesBase, { defaultSettings } from './storage-utilities-base';
import { StorageTypes } from './enums/storage-types';
import { IStorageNotifier } from './interfaces/storage-typings';

/**
 * Provides Core functionality for StorageUtilities,
 * including getItem(), addItem(), removeItem(), removeItems(), 
 * as well as additional functionality.
 */
export class StorageUtilities<T> {
	// Used to hold the current settings applied to StorageUtilities.
	// These settings can be the default, custom settings, or both.
	private static _settings: IStorageSettings;

	/**
	 * An Observable type property that allows subscribers to be notified of any storage state changes.
	 * @returns: { storage: StorageTypes, oldValue: T, newValue: T }
	 */
	storageStateChanged: Observable<IStorageNotifier<T>>;

	constructor(settings?: IStorageSettings) {
		StorageUtilities._settings = {
			...StorageUtilitiesBase.defaultSettings,
			...settings
		};
		if (settings) {
			StorageUtilitiesBase.setCustomSettings(StorageUtilities._settings);
		}
		if (StorageUtilities._settings.notifiedOfStateChanges) {
			this.storageStateChanged = this.getStorageState();
		}
	}

	/**
     * Get default settings applied to StorageUtilities.
     * @returns default settings
     */
	static get defaultSettings(): IStorageSettings {
		return StorageUtilitiesBase.defaultSettings;
	}

	/**
     * Get current settings applied to StorageUtilities.
     * These can be either the default, custom settings, or both.
     * @returns currently applied settings
     */
	static get currentSettings(): IStorageSettings {
		return this._settings;
	}

	/**
     * Set custom settings to be applied to StorageUtilities,
     * they always overwrite default settings.
     * @param settings the custom settings to be applied to StorageUtilities
     */
	static set customSettings(settings: IStorageSettings) {
		if (!settings || _.isEmpty(settings)) {
			throw new Error(`The settings ${settings} are invalid!`);
		}
		StorageUtilities._settings = settings;
		StorageUtilitiesBase.setCustomSettings(settings);
	}

	/**
     * Reset to default settings applied to StorageUtilities.
     */
	static resetSettings(): void {
		StorageUtilities._settings = defaultSettings;
		StorageUtilitiesBase.resetSettings();
	}

	/**
     * Returns the item stored in Storage by its key. 
     * If item is not found, or it has an expiry time which has elapsed, null will be returned.
     * The item can be returned as a Promise or Observable if @param returnType is specified.
     * The item is returned from localStorage by default, or sessionStorage as specified by @param storageType.
     * @param key the item's key
     * @param storageType (optional) localStorage (default) / sessionStorage
	 * @param returnType (optional) Promise / Observable
     * @returns the stored item, or null if item is not found or has expired
     */
	protected getItem(key: string, storageType?: StorageTypes, returnType?: StorageReturnTypes): T {
		return this._getDataBasedOnReturnType(StorageUtilitiesBase.getItem(key, storageType), returnType);
	}

	/**
     * Adds the item to Storage with its key.
     * The item is added to localStorage by default, or sessionStorage if specified by @param storageType.
     * The item can be added with an expiry time (in milliseconds).
     * This is to add a TTL (Time to live) to invalidate item after the expiry time elapses.
     * @param key the item's key
     * @param item the item to be added to Storage
     * @param expiry (optional) the expiry time (in milliseconds)
     * @param storageType (optional) localStorage (default) / sessionStorage
     */
	protected addItem(key: string, item: T, expiry?: number, storageType?: StorageTypes): void {
		StorageUtilitiesBase.addItem(key, item, expiry, storageType);
	}

	/**
	 * Updates the value of a specific property for the stored item.
	 * The property can be of any type. If the property doesn't exist, a new property will be created.
	 * If the item is not found by key, or has expired, null will be returned, or updated item otherwise.
	 * @param key the item's key
	 * @param propName the item's property to be updated
	 * @param newValue the item's property's new value
	 * @param storageType (optional) localStorage (default) / sessionStorage
	 * @returns the updated item, or null if item is not found or has expired
	 */
	protected updateItemProperty(key: string, propName: string, newValue: any, storageType?: StorageTypes): T {
		return StorageUtilitiesBase.updateItemProp(key, propName, newValue, storageType) as T;
	}

	/**
	 * Removes the item's specified property.
	 * If the item is not found by key, or has expired, null will be returned, or updated item otherwise.
	 * @param key the item's key
	 * @param propName the item's property to be removed
	 * @param storageType (optional) localStorage (default) / sessionStorage
	 * @returns the updated item, or null if item is not found or has expired
	 */
	protected removeItemProperty(key: string, propName: string, storageType?: StorageTypes): T {
		return StorageUtilitiesBase.removeItemProp(key, propName, storageType) as T;
	}

	/**
     * Removes item from Storage by its key.
     * The item is removed from localStorage by default, or sessionStorage if specified by @param storageType.
     * @param key the item's key
     * @param storageType (optional) localStorage (default) / sessionStorage 
     */
	protected removeItem(key: string, storageType?: StorageTypes): void {
		StorageUtilitiesBase.removeItem(key, storageType);
	}

	/**
     * Removes items from Storage by their keys.
     * The items are removed from localStorage by default, or sessionStorage if specified by @param storageType.
     * @param keys the items' keys
     * @param storageType (optional) localStorage (default) / sessionStorage 
     */
	protected removeItems(keys: string[], storageType?: StorageTypes): void {
		StorageUtilitiesBase.removeItems(keys, storageType);
	}

	/**
     * Returns storage state as an Observable of type IStorageNotifier.
     * All subscribers will be notified when state changes.
     * @returns storage state of Observable type
     */
	protected getStorageState(): Observable<IStorageNotifier<T>> {
		return StorageUtilitiesBase.getStateObservable() as Observable<IStorageNotifier<T>>;
	}

	/**
     * Returns an Array of all storage items.
     * The items are returned from localStorage by default, or sessionStorage if specified by @param storageType.
     * The items can be returned as a Promise or Observable if @param returnType is specified.
     * @param storageType (optional) localStorage (default) / sessionStorage
	 * @param returnType (optional) Promise or Observable
     * @returns an Array of all storage items
     */
	protected getStorageItems(storageType?: StorageTypes, returnType?: StorageReturnTypes): StorageItem<T>[] {
		return this._getDataBasedOnReturnType(StorageUtilitiesBase.getItems(storageType), returnType);
	}

	/**
     * Returns an Array of all storage values.
     * The values are returned from localStorage by default, or sessionStorage if specified by @param storageType.
     * The values can be returned as a Promise or Observable if @param returnType is specified.
     * @param storageType (optional) localStorage (default) / sessionStorage
	 * @param returnType (optional) Promise or Observable
     * @returns an Array of all storage values
     */
	protected getStorageValues(storageType?: StorageTypes, returnType?: StorageReturnTypes): T[] {
		return this._getDataBasedOnReturnType(StorageUtilitiesBase.getValues(storageType), returnType);
	}

	/**
     * Returns an Array of all storage keys.
     * The keys are returned from localStorage by default, or sessionStorage if specified by @param storageType.
     * The keys can be returned as a Promise or Observable if @param returnType is specified.
     * @param storageType (optional) localStorage (default) / sessionStorage
	 * @param returnType (optional) Promise or Observable
     * @returns an Array of all storage keys
     */
	protected getStorageKeys(storageType?: StorageTypes, returnType?: StorageReturnTypes): string[] {
		return this._getDataBasedOnReturnType(StorageUtilitiesBase.getKeys(storageType), returnType);
	}

	/**
     * Removes all items from storage.
     * The items are removed from localStorage by default, or sessionStorage if specified by @param storageType.
     * @param storageType (optional) localStorage (default) / sessionStorage
     */
	protected clearStorage(storageType?: StorageTypes): void {
		StorageUtilitiesBase.clearAll(storageType);
	}

	private _getDataBasedOnReturnType(data: any, returnType: StorageReturnTypes): any {
		const type = returnType || StorageUtilities._settings.setReturnType;
		if (type) {
			if (type === 'promise') {
				return Promise.resolve(data);
			} else if (type === 'observable') {
				return of(data);
			} else {
				throw new Error(`Return type ${type} is not supported!`);
			}
		} else {
			return data;
		}
	}
}
