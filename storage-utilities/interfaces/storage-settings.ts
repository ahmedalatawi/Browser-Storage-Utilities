import { StorageTypes } from '../enums/storage-types';
import { StorageReturnTypes } from '../enums/storage-return-types';

/**
 * Settings applied to service's level
 * Some of these settings can also be applied per method
 * For example, setExpiryMilliseconds and setReturnType
 * can be set as parameters for 
 * addItem(  key: string,
 *           type: StorageTypes, 
 *           expiry: number, 
 *           returnType: StorageReturnTypes
 *        )
 * 
 */
export interface IStorageSettings {
	keyPrefix?: string;
	type?: StorageTypes;
	setExpiryMilliseconds?: number;
	setReturnType?: StorageReturnTypes;
	notifiedOfStateChanges?: boolean;
}
