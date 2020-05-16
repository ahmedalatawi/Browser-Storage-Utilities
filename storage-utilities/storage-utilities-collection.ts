import { StorageBase } from 'base/storage-base';
import { IStorageCollectionOperations } from './interfaces/storage-operations';
import { defaultSettings } from './storage-utilities-basic';

class StorageUtilitiesCollection<T> extends StorageBase<T> implements IStorageCollectionOperations<T> {
	findOne(key: string, id: string): T {
		throw new Error('Method not implemented.');
	}
	findAll(key: string): T[] {
		throw new Error('Method not implemented.');
	}
	addOne(key: string, item: T): void {
		throw new Error('Method not implemented.');
	}
	addAll(key: string, items: T[]): void {
		throw new Error('Method not implemented.');
	}
	removeOne(key: string, id: string): void {
		throw new Error('Method not implemented.');
	}
	reset(key: string): void {
		throw new Error('Method not implemented.');
	}
}

export default new StorageUtilitiesCollection(defaultSettings);
