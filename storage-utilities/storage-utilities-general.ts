import { IStorageGeneralOperations } from './interfaces/storage-operations';
import { StorageItem } from './models/storage-item';
import { StorageBase } from './base/storage-base';
import { defaultSettings } from './storage-utilities-basic';
import { IStorageSettings } from './interfaces/storage-settings';
import { StorageTypes } from './enums/storage-types';
import { Observable } from 'rxjs';
import { IStorageNotifier } from './interfaces/storage-typings';

/**
 * Provides general functionality for StorageUtilities.
 */
class StorageUtilitiesGeneral<T> extends StorageBase<T> implements IStorageGeneralOperations<T> {
	constructor(settings: IStorageSettings) {
		super(settings);
	}

	setCustomSettings(settings: IStorageSettings): void {
		this.setSettings(settings);
	}

	getStateObservable(): Observable<IStorageNotifier<T>> {
		return this.getNotifierObservable();
	}

	getItems(type?: StorageTypes): StorageItem<T>[] {
		const items = new Array<StorageItem<T>>();
		const storage = this.getStorage(type);
		for (let i = 0; i < storage.length; i++) {
			const key = storage.key(i);
			const value: any = storage.getItem(key);

			items.push(
				new StorageItem<T>({
					key: key,
					value: value
				})
			);
		}
		return items;
	}

	getValues(type?: StorageTypes): T[] {
		const values = new Array<T>();
		const storage = this.getStorage(type);
		for (let i = 0; i < storage.length; i++) {
			const key = storage.key(i);
			const value: any = storage.getItem(key);

			values.push(value);
		}
		return values;
	}

	getKeys(type?: StorageTypes): string[] {
		const keys = new Array<string>();
		const storage = this.getStorage(type);
		for (let i = 0; i < storage.length; i++) {
			keys.push(storage.key(i));
		}
		return keys;
	}
}

export default new StorageUtilitiesGeneral(defaultSettings);
