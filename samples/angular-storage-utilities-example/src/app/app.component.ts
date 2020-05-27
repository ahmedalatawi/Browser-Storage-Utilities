import { Component, OnInit, OnDestroy } from '@angular/core';
import { StorageTypes } from 'browser-storage-utilities';
import { CustomerStorageUtilsService } from './services/customer-storage-utils.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit, OnDestroy {
	localStorageItems = [];
	sessionStorageItems = [];

	title = 'Browser Storage Utilities Example in Angular';

	private storageStateSubscription: Subscription;

	constructor(private customerStorageUtilsSvc: CustomerStorageUtilsService) {}

	ngOnInit(): void {
		this.storageStateSubscription = this.customerStorageUtilsSvc.storageStateChanged.subscribe((state) => {
			if (state) {
				console.log('storage: ', state.storage);
				console.log('oldValue: ', state.oldValue);
				console.log('newValue: ', state.newValue);
			}

			setTimeout(() => {
				this.localStorageItems = this.customerStorageUtilsSvc.getCustomerItems(StorageTypes.LOCAL);
				this.sessionStorageItems = this.customerStorageUtilsSvc.getCustomerItems(StorageTypes.SESSION);
			});
		});
	}

	ngOnDestroy(): void {
		this.storageStateSubscription && this.storageStateSubscription.unsubscribe();
	}
}
