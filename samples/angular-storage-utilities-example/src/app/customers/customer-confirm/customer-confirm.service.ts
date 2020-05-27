import { Injectable } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CustomerConfirmComponent } from './customer-confirm.component';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CustomerConfirmService {
	private dialogRef: MatDialogRef<CustomerConfirmComponent>;

	constructor(private dialog: MatDialog) {}

	confirm(title: string, msg: string): Observable<any> {
		this.dialogRef = this.dialog.open(CustomerConfirmComponent);
		this.dialogRef.componentInstance.title = title;
		this.dialogRef.componentInstance.msg = msg;
		return this.dialogRef.afterClosed();
	}
}
