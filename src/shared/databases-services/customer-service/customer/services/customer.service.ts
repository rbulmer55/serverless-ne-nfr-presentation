import { Customer as Model, CustomerModel } from '../model';
import { getEntity } from '../../base-services';

async function getCustomer(id: string): Promise<CustomerModel> {
	try {
		return await getEntity(Model, { _id: id }, {}, {});
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export const customerService = {
	getCustomer,
};
