import { Customer } from '@models/customer';
import { connect } from '@shared/databases-services/customer-service/connection';
import { customerService } from '@shared/databases-services/customer-service/customer/services';
import { error } from 'console';

let attempt = 0;

export const getCustomer = async (id: string): Promise<Customer> => {
	attempt = 0;
	console.log('Secondary Adapter: Connecting to database');
	await connect();

	console.log('Secondary Adapter: Retrieving customer Id');

	const serviceResponse = await getCustomerCall(id);

	const { _id, ...customer } = serviceResponse.toObject();

	return customer as Customer;
};

async function getCustomerCall(id: string) {
	try {
		return await customerService.getCustomer(id);
	} catch (error) {
		// Advanced - Check error code. i.e 429
		if (attempt < 3) {
			attempt += 1;
			const backoffDelay = 100;
			console.warn(
				`Request failed. Retry attempt ${attempt} after ${backoffDelay}ms`
			);
			await new Promise((resolve) => setTimeout(resolve, backoffDelay));
			return getCustomerCall(id);
		}
	}
	throw error;
}
