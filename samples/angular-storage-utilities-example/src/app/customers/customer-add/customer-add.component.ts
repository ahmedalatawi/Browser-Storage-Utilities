import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomerDetailComponent } from '../customer-detail/customer-detail.component';
import { FormErrorsService } from '../../services/form-errors.service';
import { CustomerStorageUtilsService } from 'src/app/services/customer-storage-utils.service';
import { Customer } from 'src/app/typings/customer';
import { StorageTypes } from 'browser-storage-utilities';

@Component({
	selector: 'app-customer-add',
	templateUrl: './customer-add.component.html'
})
export class CustomerAddComponent {
	@ViewChild(CustomerDetailComponent) addCustomerForm: CustomerDetailComponent;

	constructor(
		private dialogRef: MatDialogRef<CustomerDetailComponent>,
		private formErrorsService: FormErrorsService,
		private customerStorageUtilsSvc: CustomerStorageUtilsService
	) {}

	closeModal(): void {
		this.dialogRef.close();
	}

	add(): void {
		if (this.addCustomerForm.customerForm.valid) {
			const customer: Customer = this.addCustomerForm.customerForm.value;
			customer.type = 'customer';
			customer.address = this.customerStorageUtilsSvc.getAddress(customer);

			const customers = [
				...this.customerStorageUtilsSvc.getCustomerValues(StorageTypes.LOCAL),
				...this.customerStorageUtilsSvc.getCustomerValues(StorageTypes.SESSION)
			];

			const id = this.customerStorageUtilsSvc.genId(customers);
			const now = new Date();
			customer.id = id;
			customer.expiryTime = customer.expireIn ? now.getTime() + customer.expireIn : customer.expireIn;
			this.customerStorageUtilsSvc.addOrUpdateCustomer(
				id.toString(),
				customer,
				customer.expireIn,
				StorageTypes[customer.storage]
			);

			this.closeModal();
		} else {
			this.addCustomerForm.formErrors = this.formErrorsService.validateForm(
				this.addCustomerForm.customerForm,
				this.addCustomerForm.formErrors,
				false
			);
		}
	}
}
