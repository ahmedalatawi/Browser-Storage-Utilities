import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-customer-confirm',
	templateUrl: './customer-confirm.component.html'
})
export class CustomerConfirmComponent {
	title: string;
	msg: string;

	dialog: MatDialogRef<CustomerConfirmComponent>;

	constructor(dialogRef: MatDialogRef<CustomerConfirmComponent>) {
		this.dialog = dialogRef;
	}
}
