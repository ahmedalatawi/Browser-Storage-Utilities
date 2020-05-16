import * as _ from 'lodash';
import { IStorageSettings } from './interfaces/storage-settings';
import { StorageReturnTypes } from './enums/storage-return-types';
import { StorageItem } from './models/storage-item';
import { of, Observable } from 'rxjs';

import StorageUtilitiesBasic, { defaultSettings } from './storage-utilities-basic';
import StorageUtilitiesGeneral from './storage-utilities-general';
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

	constructor(settings?: IStorageSettings) {
		StorageUtilities._settings = {
			...StorageUtilitiesBasic.defaultSettings,
			...settings
		};
		if (settings) {
			StorageUtilitiesBasic.setCustomSettings(StorageUtilities._settings);
			StorageUtilitiesGeneral.setCustomSettings(StorageUtilities._settings);
		}
	}

	/**
     * Get default settings applied to StorageUtilities.
     * @returns default settings
     */
	static get defaultSettings(): IStorageSettings {
		return StorageUtilitiesBasic.defaultSettings;
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
		StorageUtilitiesBasic.setCustomSettings(settings);
	}

	/**
     * Reset to default settings applied to StorageUtilities.
     */
	static resetSettings(): void {
		StorageUtilities._settings = defaultSettings;
		StorageUtilitiesBasic.resetSettings();
	}

	/**
     * Returns the item stored in Storage by its key. 
     * If item is not found, or it has an expiry time which has elapsed, null will be returned.
     * The item can be returned as a Promise or Observable if @param returnType is specified.
     * The item is returned from localStorage by default, or sessionStorage as specified by @param storageType.
     * @param key the item's key
     * @param returnType (optional) Promise / Observable
     * @param storageType (optional) localStorage (default) / sessionStorage
     * @returns the stored item, or null if item is not found or has expired
     */
	protected getItem(key: string, returnType?: StorageReturnTypes, storageType?: StorageTypes): T {
		return this._getDataBasedOnReturnType(StorageUtilitiesBasic.getItem(key, storageType), returnType);
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
		StorageUtilitiesBasic.addItem(key, item, expiry, storageType);
	}

	/**
     * Removes item from Storage by its key.
     * The item is removed from localStorage by default, or sessionStorage if specified by @param storageType.
     * @param key the item's key
     * @param storageType (optional) localStorage (default) / sessionStorage 
     */
	protected removeItem(key: string, storageType?: StorageTypes): void {
		StorageUtilitiesBasic.removeItem(key, storageType);
	}

	/**
     * Removes items from Storage by their keys.
     * The items are removed from localStorage by default, or sessionStorage if specified by @param storageType.
     * @param keys the items' keys
     * @param storageType (optional) localStorage (default) / sessionStorage 
     */
	protected removeItems(keys: string[], storageType?: StorageTypes): void {
		StorageUtilitiesBasic.removeItems(keys, storageType);
	}

	/**
     * Returns storage state as an Observable of type IStorageNotifier.
     * All subscribers will be notified when state changes.
     * @returns storage state of Observable type
     */
	protected getStorageState(): Observable<IStorageNotifier<T>> {
		return StorageUtilitiesGeneral.getStateObservable() as Observable<IStorageNotifier<T>>;
	}

	/**
     * Returns an Array of all storage items.
     * The items are returned from localStorage by default, or sessionStorage if specified by @param storageType.
     * The items can be returned as a Promise or Observable if @param returnType is specified.
     * @param returnType (optional) Promise or Observable
     * @param storageType (optional) localStorage (default) / sessionStorage
     * @returns an Array of all storage items
     */
	protected getStorageItems(returnType?: StorageReturnTypes, storageType?: StorageTypes): StorageItem<T>[] {
		return this._getDataBasedOnReturnType(StorageUtilitiesGeneral.getItems(storageType), returnType);
	}

	/**
     * Returns an Array of all storage values.
     * The values are returned from localStorage by default, or sessionStorage if specified by @param storageType.
     * The values can be returned as a Promise or Observable if @param returnType is specified.
     * @param returnType (optional) Promise or Observable
     * @param storageType (optional) localStorage (default) / sessionStorage
     * @returns an Array of all storage values
     */
	protected getStorageValues(returnType?: StorageReturnTypes, storageType?: StorageTypes): T[] {
		return this._getDataBasedOnReturnType(StorageUtilitiesGeneral.getValues(storageType), returnType);
	}

	/**
     * Returns an Array of all storage keys.
     * The keys are returned from localStorage by default, or sessionStorage if specified by @param storageType.
     * The keys can be returned as a Promise or Observable if @param returnType is specified.
     * @param returnType (optional) Promise or Observable
     * @param storageType (optional) localStorage (default) / sessionStorage
     * @returns an Array of all storage keys
     */
	protected getStorageKeys(returnType?: StorageReturnTypes, storageType?: StorageTypes): string[] {
		return this._getDataBasedOnReturnType(StorageUtilitiesGeneral.getKeys(storageType), returnType);
	}

	/**
     * Removes all items from storage.
     * The items are removed from localStorage by default, or sessionStorage if specified by @param storageType.
     * @param storageType (optional) localStorage (default) / sessionStorage
     */
	protected clearStorage(storageType?: StorageTypes): void {
		StorageUtilitiesBasic.clearAll(storageType);
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
