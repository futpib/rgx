import camelcase from 'camelcase';
import decamelize from 'decamelize';

import { Context } from './context.js';

type RgxOptions = {
	identifier?: string;
};

function arrayUnique<T>(array: T[]): T[] {
	return Array.from(new Set(array));
}

function identifierToPattern(identifier: string) {
	const identifierCamelcase = camelcase(identifier);
	const identifierPascalcase = camelcase(identifierCamelcase, { pascalCase: true });
	const identifierKebabcase = decamelize(identifierCamelcase, { separator: '-' });
	const identifierSnakecase = decamelize(identifierCamelcase, { separator: '_' });
	const identifierSnakecasePreserveConsecutiveUppercase = decamelize(identifierCamelcase, { separator: '_', preserveConsecutiveUppercase: true });
	const identifierConstantcase = identifierSnakecase.toUpperCase();

	const patternOptions = arrayUnique([
		identifierCamelcase,
		identifierPascalcase,
		identifierKebabcase,
		identifierSnakecase,
		identifierSnakecasePreserveConsecutiveUppercase,
		identifierConstantcase,
	]).join('|');

	const pattern = [
		'(?<=\\W|^)',
		'(',
		patternOptions,
		')',
		'(?=\\W|$)',
	].join('');

	return pattern;
}

export async function rgx(context: Context, pattern: undefined | string, { identifier }: RgxOptions) {
	if (identifier) {
		pattern = identifierToPattern(identifier);
	}

	if (!pattern) {
		throw new Error('Missing pattern');
	}

	await context.executeRg([ pattern ]);
}
