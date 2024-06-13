import { v4 as uuid } from 'uuid';
import { regexes } from '../../../../regex-validation';

export function idVirtual(this: any) {
	return this._id;
}

export const _id = {
	default: uuid(),
	required: false,
	type: String,
	validate: new RegExp(regexes.shared.uuid),
};

export const identifier = {
	required: true,
	type: String,
	validate: new RegExp(regexes.shared.uuid),
	public: true,
};
