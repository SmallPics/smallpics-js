import { test } from 'vitest';
import assert from 'node:assert/strict';
import { UrlBuilder, Options } from '../dist/index.js';
import { signUrl } from '../dist/server.js';

const builder = new UrlBuilder('https://images.example.com');

test('matches PHP option aliases and canonical ordering', () => {
	assert.equal(
		builder.buildUrl('/images/image.jpg/', {
			width: 300,
			height: 400,
			fit: 'fill',
			watermarkPosition: 'center',
		}),
		'https://images.example.com/images/image.jpg?fit=fill&h=400&markpos=center&w=300',
	);
});

test('supports composite options, flags, defaults and removal', () => {
	const options = new Options({
		crop: [100, 200, 10, 20],
		focalPoint: ['45w', '25h'],
		border: [5, 'ff0000', 'overlay'],
		passthrough: false,
		debug: false,
	});

	assert.equal(
		builder.buildUrl('bird.jpg', options),
		'https://images.example.com/bird.jpg?border=5,ff0000,overlay&crop=100,200,10,20&debug=0&fp=45w:25h',
	);

	assert.equal(
		new UrlBuilder('https://images.example.com', {
			width: 100,
			quality: 80,
		}).buildUrl('a.jpg', { w: 200, q: null }),
		'https://images.example.com/a.jpg?w=200',
	);
});

test('merges source query parameters and removes stale signatures', () => {
	assert.equal(
		builder.buildUrl('bird.jpg?W=10&w=20&s=old&signature=old', { width: 30 }),
		'https://images.example.com/bird.jpg?w=30',
	);
});

test('encodes delimiters without changing path segments', () => {
	const url = new URL(
		builder.buildUrl('folder/a b.jpg', { mark: 'logos/a&b.png', bg: '#fff' }),
	);

	assert.equal(url.pathname, '/folder/a%20b.jpg');

	assert.equal(url.searchParams.get('mark'), 'logos/a&b.png');

	assert.equal(url.searchParams.get('bg'), '#fff');

	assert.throws(() => builder.buildUrl('../escape.jpg'));

	assert.throws(() => builder.buildUrl('https://other.test/a.jpg'));
});

test('creates sorted responsive variants preserving aspect ratio', () => {
	assert.equal(
		builder.buildSrcset('a.jpg', [800, 400, 400], { width: 800, height: 600 }),
		'https://images.example.com/a.jpg?h=300&w=400 400w, https://images.example.com/a.jpg?h=600&w=800 800w',
	);

	assert.throws(() => builder.buildSrcset('a.jpg', [0]));
});

test('matches PHP HMAC fixtures including unicode', async () => {
	const cases = [
		[
			'images/image.jpg',
			{ width: 300, height: 400 },
			'zUweQjgXXIPf89xQ6ZwWKiR6oaKLrb8uY3NZWQz7xCY',
		],
		[
			'images/image.jpg',
			{ border: [5, 'ff0000', 'overlay'], quality: 80, format: 'png' },
			'aENMpKwCgmLFxdo1KipXNVWsNvmOMbgxa6pGRI',
		],
		[
			'images/unicode-%E9%BD%90%E8%89%B2-0.png',
			{ format: 'avif', quality: 90, width: 600, height: 600, fit: 'contain' },
			'QdTpLQU32MvZqPpWTHupc6foZ3EHeVCLf2R1y6RW3U',
		],
	];

	for (const [path, params, signature] of cases) {
		assert.equal(
			await signUrl(builder.buildUrl(path, params), 'my-secret-value'),
			builder.buildUrl(path, params) + '&s=' + signature,
		);
	}
});

test('re-signs URLs with multiple stale signature parameters', async () => {
	const unsigned = 'https://images.example.com/images/image.jpg?h=400&w=300';

	assert.equal(
		await signUrl(unsigned + '&s=old&signature=older', 'my-secret-value'),
		unsigned + '&s=zUweQjgXXIPf89xQ6ZwWKiR6oaKLrb8uY3NZWQz7xCY',
	);

	assert.equal(
		await signUrl(unsigned + '#fragment', 'my-secret-value'),
		unsigned + '&s=zUweQjgXXIPf89xQ6ZwWKiR6oaKLrb8uY3NZWQz7xCY',
	);
});

test('rejects malformed paths and non-scalar transform values', () => {
	for (const path of [
		'',
		'//evil.test/a.jpg',
		'a/../b.jpg',
		'a/%2e%2e/b.jpg',
		'a/%2fb.jpg',
		'a\\b.jpg',
	]) {
		assert.throws(() => builder.buildUrl(path));
	}

	assert.throws(() => builder.buildUrl('a.jpg', { w: NaN }));

	assert.throws(() => builder.buildUrl('a.jpg', { w: { invalid: true } }));

	assert.equal(new Options().get('constructor'), undefined);
});

test('does not mutate defaults or options', () => {
	const defaults = { width: 300, format: 'jpeg' };

	const options = new Options({ height: 200 });

	const b = new UrlBuilder('https://images.example.com', defaults);

	b.buildUrl('a.jpg', options);

	assert.deepEqual(defaults, { width: 300, format: 'jpeg' });

	assert.deepEqual(options.toObject(), { h: '200' });
});
