import { Injectable } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';

@Injectable({
	providedIn: 'root'
})
export class ErrorMatcherService implements ErrorStateMatcher {
	constructor() {}

	isErrorState(control: FormControl, form: FormGroupDirective | NgForm): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

export const errorMsges: { [key: string]: string } = {
	required: 'Field is required'
};
