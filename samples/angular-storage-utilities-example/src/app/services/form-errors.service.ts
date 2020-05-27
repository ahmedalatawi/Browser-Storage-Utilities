import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
	providedIn: 'root'
})
export class FormErrorsService {
	constructor() {}

	validationMessages() {
		const messages = {
			required: 'Field is required'
		};
		return messages;
	}

	validateForm(formToValidate: FormGroup, formErrors: any, checkDirty?: boolean) {
		const form = formToValidate;
		for (const field in formErrors) {
			if (field) {
				formErrors[field] = '';
				const control = form.get(field);

				const messages = this.validationMessages();
				if (control && !control.valid) {
					if (!checkDirty || (control.dirty || control.touched)) {
						for (const key in control.errors) {
							formErrors[field] = formErrors[field] || messages[key](control.errors[key]);
						}
					}
				}
			}
		}
		return formErrors;
	}
}
