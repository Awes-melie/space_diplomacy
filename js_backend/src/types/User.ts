import { FromSchema, JSONSchema } from 'json-schema-to-ts';
import { makeValidator } from '../validation';

export const userCreationBodySchema = {
	type: 'object',
	properties: {
		email: { type: 'string', minLength: 4, maxLength: 320, pattern: '' },
		displayName: { type: 'string', minLength: 3, maxLength: 32 },
	},
	additionalProperties: false,
	required: ['email', 'displayName'],
} as const satisfies JSONSchema;

export type UserCreationRequestBody = FromSchema<typeof userCreationBodySchema>;
