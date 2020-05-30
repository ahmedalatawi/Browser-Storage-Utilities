import { StorageTypes } from '../enums/storage-types';
import { StorageReturnTypes } from '../enums/storage-return-types';

/**
 * Global/class level settings
 */
export interface IStorageSettings {
	keyPrefix?: string;
	type?: StorageTypes;
	setExpiryMilliseconds?: number;
	setReturnType?: StorageReturnTypes;
	notifiedOfStateChanges?: boolean;
}
