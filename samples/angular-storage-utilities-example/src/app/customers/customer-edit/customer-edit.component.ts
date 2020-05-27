import { Component, ViewChild, Inject, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Customer } from '../../typings/customer';
import { CustomerDetailComponent } from '../customer-detail/customer-detail.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerStorageUtilsService } from '../../services/customer-storage-utils.service';
import { StorageTypes } from 'browser-storage-utilities';

@Component({
	selector: 'app-customer-edit',
	templateUrl: './customer-edit.component.html'
})
export class CustomerEditComponent implements AfterViewInit {
	@ViewChild(CustomerDetailComponent) customerDetailForm: CustomerDetailComponent;

	dialogRef: MatDialogRef<CustomerEditComponent>;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		dialogRef: MatDialogRef<CustomerEditComponent>,
		private customerStorageUtilsSvc: CustomerStorageUtilsService,
		private cdr: ChangeDetectorRef
	) {
		this.dialogRef = dialogRef;
	}

	ngAfterViewInit(): void {
		this.fillInFormWithExistingCustomerData();
		this.cdr.detectChanges();
	}

	update(customer: Customer) {
		if (this.customerDetailForm.customerForm.valid) {
			const now = new Date();
			customer.type = 'customer';
			customer.expiryTime = customer.expireIn ? now.getTime() + customer.expireIn : customer.expireIn;
			customer.address = this.customerStorageUtilsSvc.getAddress(customer);
			this.customerStorageUtilsSvc.selectCustomer(customer);
			// when same customer is being moved between storages, make sure it's removed from previous storage first
			if (this.data.customer.storage !== customer.storage) {
				this.customerStorageUtilsSvc.removeCustomer(
					this.data.customer.id,
					StorageTypes[this.data.customer.storage]
				);
			}
			this.customerStorageUtilsSvc.addOrUpdateCustomer(
				customer.id.toString(),
				customer,
				customer.expireIn,
				StorageTypes[customer.storage]
			);
			this.dialogRef.close();
		}
	}

	fillInFormWithExistingCustomerData() {
		this.customerDetailForm.customerForm.setValue(this.data.customer);
	}
}
