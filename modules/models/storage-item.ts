import { IStorageItem } from '../interfaces/storage-typings';

export class StorageItem<T> {
	key: string;
	value: T;

	constructor(entity: IStorageItem<T>) {
		this.key = entity.key;
		this.value = entity.value;
	}
}
