import { StorageUtilities } from '../storage-utilities';
import { MockProduct } from './mock-interfaces';

// (<any>global).isTesting = true;

export class ProductStorage extends StorageUtilities<MockProduct> {
	constructor() {
		super({ isTesting: true } as any);
	}

	getDefaultSettings() {
		return ProductStorage.defaultSettings;
	}

	getCurrentSettings(): any {
		return ProductStorage.currentSettings;
	}

	addProduct(key: string, product: MockProduct) {
		this.addItem(key, product);
	}

	getProduct(key: string): MockProduct {
		return this.getItem(key);
	}

	removeProduct(key: string) {
		this.removeItem(key);
	}
}
