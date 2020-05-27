import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ErrorMatcherService, errorMsges } from '../../services/error-matcher.service';

@Component({
	selector: 'app-customer-detail',
	templateUrl: './customer-detail.component.html',
	styleUrls: [ './customer-detail.component.css' ]
})
export class CustomerDetailComponent implements OnInit {
	customerForm: FormGroup;
	matcher: ErrorMatcherService;
	errorMsg = errorMsges;
	states = [ 'AL', 'AK', 'AZ', 'CA', 'VA', 'PA', 'WV', 'OH', 'LA', 'NJ', 'NY' ];

	formErrors = {
		firstName: '',
		lastName: '',
		street: '',
		city: '',
		state: '',
		zipCode: '',
		storage: '',
		expireIn: '',
		status: ''
	};

	storage = new FormControl('SESSION');
	selected = new FormControl(false);
	address = new FormControl('');
	type = new FormControl('');
	expiryTime = new FormControl('');

	constructor(matcher: ErrorMatcherService, private formBuilder: FormBuilder) {
		this.matcher = matcher;
	}

	ngOnInit(): void {
		this.customerForm = this.formBuilder.group({
			id: [ '' ],
			firstName: [ '', Validators.required ],
			lastName: [ '', Validators.required ],
			street: [ '' ],
			city: [ '' ],
			state: [ '' ],
			zipCode: [ '' ],
			storage: this.storage,
			expireIn: [ '', Validators.pattern('^[0-9]*$') ],
			status: [ '' ],
			selected: this.selected,
			address: this.address,
			type: this.type,
			expiryTime: this.expiryTime
		});
	}
}
