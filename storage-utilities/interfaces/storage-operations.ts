import { StorageItem } from '../models/storage-item';

export interface IStorageArrayReadOperations<T> {
	findOne(key: string, id: string): T;
	findAll(key: string): T[];
}

export interface IStorageArrayWriteOperations<T> {
	addOne(key: string, item: T): void;
	addAll(key: string, items: T[]): void;
	removeOne(key: string, id: string): void;
	reset(key: string): void;
}

export interface IStorageGeneralOperations<T> {
	getItems(): StorageItem<T>[];
	getValues(): T[];
	getKeys(): string[];
}

export interface IStorageCollectionOperations<T>
	extends IStorageArrayReadOperations<T>,
		IStorageArrayWriteOperations<T> {}
