#!/usr/bin/env node

import path from 'path';
import { program } from 'commander';
import { Context, createContext } from './context.js';
import { rgx } from './rgx.js';

const programName = 'rgx';

type Action = (context: Context, ...args: any[]) => Promise<void>;

function wrapAction(action: Action) {
	return async (...args: unknown[]) => {
		await action(createContext(), ...args);
	};
}

program
	.name(programName)
	.option('--identifier', 'Treat pattern as identifier (search of all possible casings with word boundaries)')
	.argument('<pattern>')
	.action(wrapAction(rgx));

program.parse(process.argv);
