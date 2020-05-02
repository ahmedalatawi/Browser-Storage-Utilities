import { expect } from 'chai';
import { ProductStorage } from './mock-product';
import { MockProduct } from './mock-interfaces';
import { StorageTypes } from '../modules/enums/storage-types';

const global = require('global');

const storage: any = {
	sessionStorage: null,
	localStorage: null
};

const initStorage = (type: StorageTypes) => {
	storage[type] = new Map();
	global[type] = {
		setItem: (k: string, v: any) => {
			storage[type].set(k, v);
		},
		getItem: (k: string) => {
			return storage[type].get(k);
		},
		removeItem: (k: string) => {
			storage[type].delete(k);
		}
	};
};

let productStorage: ProductStorage;

afterEach(() => {
	storage.sessionStorage = null;
	storage.localStorage = null;
});

describe('Storage Utilities', () => {
	describe('sessionStorage', () => {
		beforeEach(() => {
			initStorage(StorageTypes.SESSION);
			productStorage = new ProductStorage();
		});

		describe('get default settings', () => {
			it('should return default settings', () => {
				expect(productStorage.getDefaultSettings()).to.deep.equal({
					keyPrefix: '',
					type: StorageTypes.SESSION
				});
			});
		});

		describe('get current settings', () => {
			it('should return current settings', () => {
				expect(productStorage.getCurrentSettings()).to.deep.equal({
					isTesting: true,
					keyPrefix: '',
					type: StorageTypes.SESSION
				});
			});
		});

		describe('base operations', () => {
			const product: MockProduct = {
				id: 1,
				name: 'Desk',
				code: 'A1',
				customer: {
					id: 1,
					firstName: 'John',
					lastName: 'Doe'
				}
			};

			it('should add a product to session storage', () => {
				productStorage.addProduct('product', product);

				expect(storage.sessionStorage.get('product')).to.equal(JSON.stringify(product));
			});

			it('should return a product from session storage', () => {
				storage.sessionStorage.set('product', product);

				expect(productStorage.getProduct('product')).to.equal(product);
			});

			it('should remove a product from session storage', () => {
				storage.sessionStorage.set('product', product);

				productStorage.removeProduct('product');

				expect(storage.sessionStorage.get('product')).to.equal(undefined);
			});
		});
	});
});
