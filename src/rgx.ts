import camelcase from 'camelcase';
import decamelize from 'decamelize';

import { Context } from './context.js';

type RgxOptions = {
	identifier?: string;
};

function arrayUnique<T>(array: T[]): T[] {
	return Array.from(new Set(array));
}

function explodeCasesWith(identifier: string, f: (identifier: string) => string): string[] {
	return arrayUnique([
		identifier,
		f(identifier),
	]);
}

function explodeCases(identifier: string): string[] {
	let identifiers: string[] = [ identifier ];

	for (const f of [
		(identifier: string) => camelcase(identifier),
		(identifier: string) => camelcase(identifier, { pascalCase: true }),
		(identifier: string) => camelcase(identifier, { preserveConsecutiveUppercase: true }),
		(identifier: string) => decamelize(identifier, { separator: '-' }),
		(identifier: string) => decamelize(identifier, { separator: '_' }),
		(identifier: string) => decamelize(identifier, { separator: '_', preserveConsecutiveUppercase: true }),
		(identifier: string) => decamelize(identifier, { separator: '_' }).toUpperCase(),
	]) {
		identifiers = arrayUnique(identifiers.flatMap((identifier) => explodeCasesWith(identifier, f)));
	}

	return identifiers;
}

function identifierToPattern(identifier: string) {
	const patternOptions = arrayUnique(explodeCases(identifier)).join('|');

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
