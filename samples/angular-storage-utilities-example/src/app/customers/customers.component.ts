import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CustomerStorageUtilsService } from '../services/customer-storage-utils.service';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerAddComponent } from './customer-add/customer-add.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { StorageTypes } from 'browser-storage-utilities';
import { Customer } from '../typings/customer';
import { CustomerConfirmService } from './customer-confirm/customer-confirm.service';

@Component({
	selector: 'app-customers',
	templateUrl: './customers.component.html',
	styleUrls: [ './customers.component.css' ]
})
export class CustomersComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild(MatPaginator) paginator: MatPaginator;

	local = true;
	session = true;
	dataLength: number;
	displayedColumns = [ 'select', 'firstName', 'lastName', 'address', 'expireIn', 'storage', 'status', 'actions' ];
	dataSource = new MatTableDataSource();
	searchTerm$ = new Subject<string>();
	statesControl = new FormControl('');
	states = [];

	private customerAddComponent = CustomerAddComponent;
	private customerEditComponent = CustomerEditComponent;

	private storageStateSubscription: Subscription;
	private customerConfirmSvcSubscription: Subscription;

	constructor(
		private customerStorageUtilsSvc: CustomerStorageUtilsService,
		private customerConfirmSvc: CustomerConfirmService,
		public dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.storageStateSubscription = this.customerStorageUtilsSvc.storageStateChanged.subscribe((state) => {
			setTimeout(() => this.getAllCustomers());
		});
	}

	ngOnDestroy(): void {
		this.storageStateSubscription && this.storageStateSubscription.unsubscribe();
		this.customerConfirmSvcSubscription && this.customerConfirmSvcSubscription.unsubscribe();
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
	}

	changeStorageType(): void {
		if (this.local && this.session) {
			this.getAllCustomers();
		} else if (this.local) {
			this.getLocalCustomers();
		} else if (this.session) {
			this.getSessionCustomers();
		} else {
			this.dataSource.data = [];
		}
	}

	getAllCustomers(): any {
		this.dataSource.data = [
			...this.customerStorageUtilsSvc.getCustomerValues(StorageTypes.SESSION),
			...this.customerStorageUtilsSvc.getCustomerValues(StorageTypes.LOCAL)
		];
	}

	getLocalCustomers(): any {
		this.dataSource.data = this.customerStorageUtilsSvc.getCustomerValues(StorageTypes.LOCAL);
	}

	getSessionCustomers(): any {
		this.dataSource.data = this.customerStorageUtilsSvc.getCustomerValues(StorageTypes.SESSION);
	}

	addCustomer() {
		this.dialog.open(this.customerAddComponent);
	}

	editCustomer(customer: Customer) {
		this.dialog.open(this.customerEditComponent, {
			data: { customer }
		});
	}

	deleteCustomer(customer: Customer) {
		const msg = `Are you sure you want to remove ${customer.firstName} ${customer.lastName} from ${customer.storage.toLowerCase()} storage?`;
		this.customerConfirmSvcSubscription = this.customerConfirmSvc
			.confirm('Delete Customer', msg)
			.subscribe((res) => {
				res && this.customerStorageUtilsSvc.removeCustomer(`${customer.id}`, StorageTypes[customer.storage]);
			});
	}

	selectCustomer(customer: Customer): void {
		const updatedCustomer = this.customerStorageUtilsSvc.updateCustomerProp(
			customer.id.toString(),
			'selected',
			customer.selected,
			StorageTypes[customer.storage]
		);

		if (!updatedCustomer) {
			alert(
				'Customer has expired, and will be automatically removed from storage upon being selected/deselected.'
			);

			// if customer is expired, remove its id from selectedCustomerIds array
			customer.selected = false;
		}
		this.customerStorageUtilsSvc.selectCustomer(customer);
	}

	removeSelected() {
		const selectedCustomerIds = this.customerStorageUtilsSvc.getSelectedCustomerIds();
		if (!selectedCustomerIds.length) {
			alert('Please select customer(s) to remove.');
			return;
		}
		const msg = `Are you sure you want to remove ${selectedCustomerIds.length} customer(s) from storage?`;
		this.customerConfirmSvcSubscription = this.customerConfirmSvc
			.confirm('Delete Customer(s)', msg)
			.subscribe((res) => {
				if (res) {
					this.customerStorageUtilsSvc.removeCustomers(selectedCustomerIds, StorageTypes.LOCAL);
					this.customerStorageUtilsSvc.removeCustomers(selectedCustomerIds, StorageTypes.SESSION);
					this.customerStorageUtilsSvc.resetSelectedCustomerIds();
				}
			});
	}
}
