import { Customer } from '../customer.model';

jest.unmock('mongoose');

let customerModel: any;

describe('Customer model', () => {
	beforeEach(() => {
		customerModel = {
			_id: '851e52e0-9444-4436-8f3d-6ffe47580458',
			fullname: 'Rob Bulmer',
			businessUnit: 'External',
			creditLimit: 0,
		};
	});

	test('should default the properties', () => {
		const customer = new Customer();
		expect(customer).toMatchSnapshot();
	});

	test('should create when supplied properties', () => {
		const customer = new Customer(customerModel);
		expect(customer).toMatchSnapshot();
	});

	describe('validate', () => {
		test('should validate id', () => {
			customerModel._id = 'invalid-not-a-uuid';
			const customer = new Customer(customerModel);
			const error = customer.validateSync();
			expect(error?.errors).toMatchSnapshot();
		});

		test('should create id', () => {
			delete customerModel._id;
			const customer = new Customer(customerModel);
			expect(customer.id).not.toEqual(customerModel._id);
			expect(customer).toMatchSnapshot();
		});
	});
});
