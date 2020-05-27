import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CustomersComponent } from './customers/customers.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomerDetailComponent } from './customers/customer-detail/customer-detail.component';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { CustomerAddComponent } from './customers/customer-add/customer-add.component';
import { CustomerEditComponent } from './customers/customer-edit/customer-edit.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatRadioModule } from '@angular/material/radio';
import { CustomerConfirmComponent } from './customers/customer-confirm/customer-confirm.component';

@NgModule({
	declarations: [
		AppComponent,
		CustomersComponent,
		CustomerDetailComponent,
		CustomerAddComponent,
		CustomerEditComponent,
		CustomerConfirmComponent
	],
	imports: [
		BrowserModule,
		FlexLayoutModule,
		HttpClientModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatSelectModule,
		MatCardModule,
		MatTableModule,
		MatCheckboxModule,
		MatPaginatorModule,
		MatDialogModule,
		MatRadioModule
	],
	providers: [ { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } } ],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
