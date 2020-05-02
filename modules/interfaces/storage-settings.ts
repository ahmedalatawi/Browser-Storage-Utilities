import { StorageTypes } from '../enums/storage-types';

export interface IStorageSettings {
	keyPrefix?: string;
	type: StorageTypes;
}
