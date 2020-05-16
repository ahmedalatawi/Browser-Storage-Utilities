export interface MockCustomer {
	id: number;
	firstName: string;
	lastName: string;
	address?: MockAddress;
}

export interface MockAddress {
	street: string;
	city: string;
	state: string;
	zip: number;
}

export interface MockProduct {
	id: number;
	name: string;
	code: string;
	customer?: MockCustomer;
	customers?: MockCustomer[];
}
