import { StorageItem } from '../models/storage-item';

export interface IStorageReadOperations<T> {
	findOne(key: string, id: string): T;
	findAll(key: string): T[];
	findAllItems(): StorageItem<T>[];
	findAllValues(): T[];
	findAllKeys(): string[];
}

export interface IStorageWriteOperations<T> {
	addOne(key: string, item: T): void;
	addAll(key: string, items: T[]): void;
	removeOne(key: string, id: string): void;
	removeAll(keys: string[]): void;
}

export interface IStorageOperations<T> extends IStorageReadOperations<T>, IStorageWriteOperations<T> {}
