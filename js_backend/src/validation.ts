import { JSONSchema } from 'json-schema-to-ts';

import Ajv, { ValidateFunction } from 'ajv';
const ajv = new Ajv();

export function makeValidator<T>(schema: JSONSchema) {
	const validate = ajv.compile<T>(schema);
	const validator = (
		data: unknown
	):
		| { valid: true; data: T; errors: undefined }
		| {
				valid: false;
				data: undefined;
				errors: ValidateFunction<T>['errors'];
		  } => {
		const valid = validate(data);
		if (valid) {
			return { valid, data, errors: undefined };
		} else {
			return { valid, errors: validate.errors, data: undefined };
		}
	};
	return validator;
}
