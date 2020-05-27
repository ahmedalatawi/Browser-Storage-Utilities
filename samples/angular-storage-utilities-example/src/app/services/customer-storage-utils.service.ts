import { Injectable } from '@angular/core';
import { Customer } from '../typings/customer';
import { StorageUtilities, StorageTypes, StorageReturnTypes, StorageItem } from 'browser-storage-utilities';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CustomerStorageUtilsService extends StorageUtilities<Customer> {
	private selectedCustomerIds = [
		...this.getSelectedCustomerStoredIds(StorageTypes.LOCAL),
		...this.getSelectedCustomerStoredIds(StorageTypes.SESSION)
	];

	constructor() {
		super({ keyPrefix: 'customer-', notifiedOfStateChanges: true, type: StorageTypes.SESSION });
	}

	getCustomer(id: string, storageType?: StorageTypes): Customer {
		return this.getItem(id, storageType);
	}

	getCustomerItems(storageType: StorageTypes): StorageItem<Customer>[] {
		return this.getStorageItems(storageType).filter((item) => this.isCustomer(item.value));
	}

	getCustomerValues(storageType: StorageTypes): Customer[] {
		const now = new Date();
		return this.getStorageValues(storageType).filter((value) => this.isCustomer(value)).map((value) => ({
			...value,
			status: value.expiryTime ? (now.getTime() > value.expiryTime ? 'expired' : 'valid') : ''
		}));
	}

	getCustomerKeys(storageType: StorageTypes): string[] {
		return this.getStorageKeys(storageType).filter((key) => key.startsWith('customer-'));
	}

	getSelectedCustomerStoredIds(storageType: StorageTypes): string[] {
		return this.getStorageValues(storageType).filter((c) => c.selected).map((customer) => customer.id.toString());
	}

	getCustomerObservable(id: string, storageType: StorageTypes): Observable<Customer> {
		return this.getItem(id, storageType, StorageReturnTypes.Observable) as any;
	}

	addOrUpdateCustomer(id: string, customer: Customer, expiry?: number, storageType?: StorageTypes): void {
		this.addItem(id, customer, expiry, storageType);
	}

	updateCustomerProp(id: string, propName: string, newValue: any, storageType?: StorageTypes): Customer {
		return this.updateItemProperty(id, propName, newValue, storageType);
	}

	removeCustomer(id: string, storageType: StorageTypes): void {
		this.removeItem(id, storageType);
	}

	removeCustomers(ids: string[], storageType: StorageTypes): void {
		this.removeItems(ids, storageType);
	}

	clearStorage(storageType: StorageTypes): void {
		this.clearStorage(storageType);
	}

	getAddress(customer: Customer): string {
		const street = customer['street'] ? (customer['city'] ? customer['street'] + ', ' : customer['street']) : '';
		const city = customer['city'] ? (customer['state'] ? customer['city'] + ', ' : customer['city']) : '';
		const state = customer['state'] ? (customer['zipCode'] ? customer['state'] + ' ' : customer['state']) : '';
		const zipCode = customer['zipCode'] ? customer['zipCode'] : '';

		return `${street}${city}${state}${zipCode}`;
	}

	genId(customers: Customer[]): number {
		return customers.length > 0 ? Math.max(...customers.map((customer) => customer.id)) + 1 : 11;
	}

	selectCustomer(customer: Customer): void {
		const id = customer.id.toString();
		if (!customer.selected) {
			const index = this.selectedCustomerIds.indexOf(id);
			if (index > -1) {
				this.selectedCustomerIds.splice(index, 1);
			}
		} else {
			if (this.selectedCustomerIds.indexOf(id) === -1) {
				this.selectedCustomerIds.push(id);
			}
		}
	}

	getSelectedCustomerIds(): string[] {
		return this.selectedCustomerIds;
	}

	resetSelectedCustomerIds(): void {
		this.selectedCustomerIds = [];
	}

	private isCustomer(item: Customer): item is Customer {
		return (<Customer>item).type === 'customer';
	}
}
