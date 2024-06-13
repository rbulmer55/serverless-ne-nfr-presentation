import { getCustomer } from '@adapters/secondary/customer/get-customer.adapter';
import { Customer } from '@models/customer';

export const getCustomerUseCase = async (id: string): Promise<Customer> => {
	console.log('Business Logic: Retrieving customer');
	return await getCustomer(id);
};
