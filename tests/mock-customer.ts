import { StorageUtilities } from '../storage-utilities';
import { MockCustomer } from './mock-interfaces';
import { StorageTypes } from '../modules/enums/storage-types';

export class CustomerStorage extends StorageUtilities<MockCustomer> {
	constructor() {
		const settings = {
			keyPrefix: 'local-test-',
			type: StorageTypes.LOCAL
		};
		super(settings);
	}
}
