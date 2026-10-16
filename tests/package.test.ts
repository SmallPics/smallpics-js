import { test, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

test('exposes generated declarations to TypeScript consumers', () => {
	execFileSync(
		process.execPath,
		[
			fileURLToPath(
				new URL('../node_modules/typescript/bin/tsc', import.meta.url),
			),
			'--noEmit',
			'--strict',
			'--module',
			'NodeNext',
			'--target',
			'ES2022',
			'--skipLibCheck',
			'--ignoreConfig',
			'tests/types/consumer.ts',
		],
		{ cwd: fileURLToPath(new URL('../', import.meta.url)), encoding: 'utf8' },
	);
});

test('works from ordinary JavaScript ES modules and CommonJS', () => {
	const cwd = fileURLToPath(new URL('../', import.meta.url));

	const esm = execFileSync(
		process.execPath,
		[
			'--input-type=module',
			'-e',
			"import {UrlBuilder} from 'smallpics-js'; console.log(new UrlBuilder('https://media.smallpics.io').buildUrl('bird.jpg',{w:400}));",
		],
		{ cwd, encoding: 'utf8' },
	);

	const cjs = execFileSync(
		process.execPath,
		[
			'--input-type=commonjs',
			'-e',
			"const {UrlBuilder}=require('smallpics-js'); console.log(new UrlBuilder('https://media.smallpics.io').buildUrl('bird.jpg',{w:400}));",
		],
		{ cwd, encoding: 'utf8' },
	);

	expect(esm.trim()).toBe('https://media.smallpics.io/bird.jpg?w=400');

	expect(cjs).toBe(esm);
});

test('does not expose the signing entry under browser resolution', () => {
	expect(() =>
		execFileSync(
			process.execPath,
			[
				'--conditions=browser',
				'--input-type=module',
				'-e',
				"import 'smallpics-js/server'",
			],
			{ cwd: fileURLToPath(new URL('../', import.meta.url)), stdio: 'pipe' },
		),
	).toThrow();
});
