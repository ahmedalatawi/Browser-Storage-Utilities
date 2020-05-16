import { StorageTypes } from '../enums/storage-types';

export interface IStorageItem<T> {
	key: string;
	value: T;
	expiry?: number;
}

export interface IStorageNotifier<T> {
	storage: StorageTypes;
	oldValue: T;
	newValue: T;
}
