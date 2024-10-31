import { execa } from "execa";

type RgOptions = {
};

async function executeRg(args: string[], {
}: RgOptions = {}) {
	console.error('+', 'rg', ...args);

	await execa('rg', args, {
		stdio: 'inherit',
	});
}

export interface Context {
	executeRg(args: string[], options?: RgOptions): Promise<void>;
}

export function createContext(): Context {
	return {
		executeRg,
	}
}
