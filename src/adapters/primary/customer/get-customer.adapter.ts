import { CustomerDTO } from '@dto/customer';
import { getCustomerUseCase } from '@use-cases/customer/get-customer.use-case';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const getCustomer = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	console.log('Primary Adapter: Validating Event');
	if (!event.pathParameters) {
		throw new Error('No path parameters provided on request.');
	}

	const { id } = event.pathParameters;
	if (!id) {
		throw new Error('No customer Id provided');
	}

	console.log(`Primary Adapter: Fetch my Customer please. ID:${id}`);
	const customer = (await getCustomerUseCase(id)) as CustomerDTO;

	if (!customer) {
		return { statusCode: 404, body: '404: Customer not found' };
	}

	return {
		statusCode: 200,
		body: JSON.stringify(customer),
	};
};
