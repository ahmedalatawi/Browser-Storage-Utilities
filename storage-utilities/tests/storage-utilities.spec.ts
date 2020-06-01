import { expect } from 'chai';
import { ProductStorage } from './mock-product';
import { MockProduct } from './mock-interfaces';
import { StorageTypes } from '../enums/storage-types';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

const global = require('global');

const storage: any = {
	sessionStorage: null,
	localStorage: null
};

const initStorage = (type: StorageTypes) => {
	storage[type] = new Map();
	global[type] = {
		key: (index: number) => {
			return Array.from(storage[type].keys())[index];
		},
		setItem: (k: string, v: any) => {
			storage[type].set(k, v);
		},
		getItem: (k: string) => {
			return storage[type].get(k);
		},
		removeItem: (k: string) => {
			storage[type].delete(k);
		},
		clear: () => {
			storage[type].clear();
		},
		length: storage[type].size
	};
};

let productStorage: ProductStorage;
let productSubscription: Subscription;

const product1: MockProduct = {
	id: 1,
	name: 'Desk',
	code: 'A1',
	customer: {
		id: 10,
		firstName: 'John',
		lastName: 'Doe'
	}
};

const product2: MockProduct = {
	id: 2,
	name: 'Laptop',
	code: 'L1',
	customer: {
		id: 20,
		firstName: 'Kate',
		lastName: 'Young'
	}
};

afterEach(() => {
	storage.sessionStorage = null;
	storage.localStorage = null;
	productSubscription && productSubscription.unsubscribe();
});

describe('Storage Utilities', () => {
	describe('localStorage', () => {
		describe('logic', () => {
			beforeEach(() => {
				productSubscription = null;
				initStorage(StorageTypes.LOCAL);
				productStorage = new ProductStorage({notifiedOfStateChanges: true});
			});

			describe('basic operations', () => {
				it('should add a product to local storage without expiry', () => {
					productStorage.addProduct('local-product-1', product1);
	
					expect(storage.localStorage.get('local-product-1')).to.equal(JSON.stringify(product1));
				});

				it('should return product if not expired yet from local storage', (done) => {
					const now = new Date();
					productStorage.addProduct('local-product-1', product1, 500);

					const product1WithExpiry = {
						value: product1,
						expiry: now.getTime() + 500
					};
	
					setTimeout(() => { 
						expect(storage.localStorage.get('local-product-1')).to.equal(JSON.stringify(product1WithExpiry));
	
						done();
	
					}, 300);
					
				});
			
				it('should return null when product is expired in 200 milliseconds, and removes it from local storage', (done) => {
					productStorage.addProduct('local-product-1', product1, 200);
	
					setTimeout(() => { 
						expect(productStorage.getProduct('local-product-1')).to.equal(null);
						expect(storage.localStorage.get('local-product-1')).to.equal(undefined);
	
						done();
	
					}, 300);
					
				});

				it('subscribe to storage state changes via storageStateChanged property', () => {
					productStorage.addProduct('local-product-1', product1);

					productSubscription = productStorage.storageStateChanged.subscribe(state => {
						expect(state).to.deep.equal({
							storage: 'localStorage',
							oldValue: undefined,
							newValue: product1
						});
					});
				});

				it('subscribe to storage state changes via getStorageState method', () => {
					productStorage.addProduct('local-product-1', product1);

					productSubscription = productStorage.getProdStorageState().subscribe(state => {
						expect(state).to.deep.equal({
							storage: 'localStorage',
							oldValue: undefined,
							newValue: product1
						});
					});
				});
			});
		});

		describe('settings', () => {
			beforeEach(() => {
				initStorage(StorageTypes.LOCAL);
			});

			describe('default settings', () => {
				productStorage = new ProductStorage();

				it('should return default settings', () => {
					expect(productStorage.getDefaultSettings()).to.deep.equal({
						keyPrefix: '',
						type: StorageTypes.LOCAL
					});
				});
			});

			describe('current settings', () => {
				it('should return current settings', () => {
					productStorage = new ProductStorage({ keyPrefix: 'local-test-', type: StorageTypes.SESSION });
	
					expect(productStorage.getCurrentSettings()).to.deep.equal({
						keyPrefix: 'local-test-',
						type: StorageTypes.SESSION
					});
				});
			});

			describe('custom settings', () => {
				it('should set custom settings', () => {
					productStorage = new ProductStorage();
					productStorage.setCustomSettings({ keyPrefix: 'custom-', type: StorageTypes.LOCAL })
	
					expect(productStorage.getCurrentSettings()).to.deep.equal({
						keyPrefix: 'custom-',
						type: StorageTypes.LOCAL
					});
				});
			});

			describe('reset settings', () => {
				it('should reset settings to default', () => {
					productStorage = new ProductStorage({ keyPrefix: 'custom-', type: StorageTypes.SESSION });
					productStorage.resetSettingsToDefault()
	
					expect(productStorage.getCurrentSettings()).to.deep.equal({
						keyPrefix: '',
						type: StorageTypes.LOCAL
					});
				});
			});
		});
	});

	describe('sessionStorage', () => {
		beforeEach(() => {
			productSubscription = null;
			initStorage(StorageTypes.SESSION);
			productStorage = new ProductStorage({ keyPrefix: 'test-', type: StorageTypes.SESSION });
		});

		describe('default settings', () => {
			it('should return default settings', () => {
				expect(productStorage.getDefaultSettings()).to.deep.equal({
					keyPrefix: '',
					type: StorageTypes.LOCAL
				});
			});
		});

		describe('current settings', () => {
			it('should return current settings', () => {
				expect(productStorage.getCurrentSettings()).to.deep.equal({
					keyPrefix: 'test-',
					type: StorageTypes.SESSION
				});
			});
		});

		describe('basic operations', () => {
			it('should add a product to session storage', () => {
				productStorage.addProduct('product-1', product1);

				expect(storage.sessionStorage.get('test-product-1')).to.equal(JSON.stringify(product1));
			});

			it('should return a product from session storage', () => {
				storage.sessionStorage.set('test-product-1', product1);

				expect(productStorage.getProduct('product-1')).to.equal(product1);
			});

			it('should return product promise from session storage', () => {
				storage.sessionStorage.set('test-product-1', product1);

				productStorage.getProductPromise('product-1').then((p) => expect(p).to.equal(product1));
			});

			it('should return product observable from session storage', () => {
				storage.sessionStorage.set('test-product-1', product1);

				productSubscription = productStorage
					.getProductObservable('product-1')
					.subscribe((p) => expect(p).to.equal(product1));
			});

			it('should remove a product from session storage', () => {
				storage.sessionStorage.set('test-product-1', product1);

				productStorage.removeProduct('product-1');

				expect(storage.sessionStorage.get('test-product-1')).to.equal(undefined);
			});

			it('should remove products by keys from session storage', () => {
				storage.sessionStorage.set('test-product-1', product1);
				storage.sessionStorage.set('test-product-2', product2);

				productStorage.removeProducts([ 'product-1', 'product-2' ]);

				expect(storage.sessionStorage.get('test-product-1')).to.equal(undefined);
				expect(storage.sessionStorage.get('test-product-2')).to.equal(undefined);
			});

			it('should clear session storage', () => {
				storage.sessionStorage.set('test-product-1', product1);
				storage.sessionStorage.set('test-product-2', product2);

				productStorage.clear();

				expect(storage.sessionStorage.get('test-product-1')).to.equal(undefined);
				expect(storage.sessionStorage.get('test-product-2')).to.equal(undefined);
			});
		});

		describe('general operations', () => {
			it('should return all storage items from session storage', () => {
				storage.sessionStorage.set('test-product-1', product1);
				storage.sessionStorage.set('test-product-2', product2);

				global.sessionStorage.length = storage.sessionStorage.size;

				expect(productStorage.getAllStorageItems()).to.deep.equal([
					{
						key: 'test-product-1',
						value: product1,
						expiry: undefined
					},
					{
						key: 'test-product-2',
						value: product2,
						expiry: undefined
					}
				]);
			});

			it('should return all storage values from session storage', () => {
				storage.sessionStorage.set('test-product-1', product1);
				storage.sessionStorage.set('test-product-2', product2);

				global.sessionStorage.length = storage.sessionStorage.size;

				expect(productStorage.getAllStorageValues()).to.deep.equal([ product1, product2 ]);
			});

			it('should return all storage keys from session storage', () => {
				storage.sessionStorage.set('test-product-1', product1);
				storage.sessionStorage.set('test-product-2', product2);

				global.sessionStorage.length = storage.sessionStorage.size;

				expect(productStorage.getAllStorageKeys()).to.deep.equal([ 'test-product-1', 'test-product-2' ]);
			});
		});
	});
});
