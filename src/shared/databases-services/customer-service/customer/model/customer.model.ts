import { Schema, model, Document } from 'mongoose';
import { _id, idVirtual } from '../../helpers/schema-constants';

const options = {
	strict: true,
	timestamps: true,
	toJson: {
		virtuals: true,
	},
	toObject: {
		virtuals: true,
	},
};

export interface CustomerModel extends Document {
	_id: string;
	fullname: string;
	businessUnit: string;
	creditLimit: number;
}

const name = 'Customers';
const customerProperties = {
	_id,
	fullname: {
		type: String,
		required: true,
		public: true,
	},
	businessUnit: {
		type: String,
		required: true,
		public: true,
	},
	creditLimit: {
		type: Number,
		required: true,
		public: true,
		default: 0,
	},
};

const schema = new Schema(customerProperties, options);

schema.virtual('id').get(idVirtual);

export const Customer = model<CustomerModel>(name, schema);
