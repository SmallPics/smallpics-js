import { expect, test } from 'vitest';
import { Options, UrlBuilder } from '../dist/index.js';

const builder = new UrlBuilder('https://images.example.com');

test('serializes every trim control through named options and fluent setters', () => {
	const named = new Options({
		trim: 'either',
		trimColor: 'ffffff',
		trimAlpha: 0,
		trimTolerance: 2.5,
		trimPadding: 8,
		trimMeanDifference: 11,
		trimStandardDeviation: 10,
	});
	const fluent = new Options()
		.setTrim('either')
		.setTrimColor('ffffff')
		.setTrimAlpha(0)
		.setTrimTolerance(2.5)
		.setTrimPadding(8)
		.setTrimMeanDifference(11)
		.setTrimStandardDeviation(10);
	for (const options of [named, fluent]) {
		expect(builder.buildUrl('a.png', options)).toBe(
			'https://images.example.com/a.png?trim=either&trim-alpha=0&trim-color=ffffff&trim-md=11&trim-pad=8&trim-sd=10&trim-tol=2.5',
		);
	}
});

test.each(['auto', 'color', 'alpha', 'either'] as const)(
	'preserves trim mode %s',
	(mode) => {
		expect(new Options().setTrim(mode).get('trim')).toBe(mode);
	},
);

test.each(['transparent', '00ffffff', '50ff0000'])(
	'preserves border color %s without CSS conversion',
	(color) => {
		const options = new Options()
			.setBorder(12, color, 'expand')
			.setFormat('png');
		expect(builder.buildUrl('a.png', options)).toBe(
			`https://images.example.com/a.png?border=12,${color},expand&fm=png`,
		);
	},
);

test('removes inherited trim controls using native keys or aliases', () => {
	const defaults = new UrlBuilder('https://images.example.com', {
		trim: 'auto',
		trimPadding: 8,
	});
	expect(defaults.buildUrl('a.png', { trim: null, 'trim-pad': null })).toBe(
		'https://images.example.com/a.png',
	);
});

test.each([1.5, '5p', '5w', '5h'])('preserves trim padding %s', (padding) => {
	for (const options of [
		new Options().setTrimPadding(padding),
		new Options({ trimPadding: padding }),
		new Options({ 'trim-pad': padding }),
	]) {
		expect(builder.buildUrl('a.png', options)).toBe(
			`https://images.example.com/a.png?trim-pad=${padding}`,
		);
	}
});
