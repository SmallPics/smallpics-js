import { describe, expect, test } from 'vitest';
import { Options, UrlBuilder, type Parameter } from '../dist/index.js';

// Ported from smallpics-php/tests/Unit/OptionsTest.php and CurrentParamsTest.php.
// Existing JS API adaptations:
// - get(name) returns serialized strings instead of PHP's typed named getters.
// - toObject() and buildUrl() replace PHP's string conversion.
// - Constructor compound values use positional arrays, not named-argument objects.
// - Constructor aspect-ratio tuples retain "width:height"; setAspectRatio divides.
// - Raw constructor parameters are flat, rather than nested under "params".
// - Enum cases are tested with their string values. No enum API is introduced.
const builder = new UrlBuilder('https://images.example.com');

// Independent fixture values, including every native parameter and long alias.
const parameters: [string, string, Parameter, string][] = [
	['or', 'orientation', 90, '90'],
	['flip', 'flip', 'both', 'both'],
	['crop', 'crop', 'facesarea,top', 'facesarea,top'],
	['crop', 'cropPosition', 'face,top', 'face,top'],
	['w', 'width', '65p', '65p'],
	['h', 'height', '50w', '50w'],
	['ar', 'aspectRatio', '16:9', '16:9'],
	['fit', 'fit', 'crop', 'crop'],
	['dpr', 'devicePixelRatio', 1.5, '1.5'],
	['bri', 'brightness', -10, '-10'],
	['con', 'contrast', 20, '20'],
	['gam', 'gamma', 1.5, '1.5'],
	['sharp', 'sharpen', 10, '10'],
	['blur', 'blur', 5, '5'],
	['pixel', 'pixelate', 8, '8'],
	['filt', 'filter', 'grayscale', 'grayscale'],
	['mark', 'watermarkPath', 'logo.svg', 'logo.svg'],
	['markorigin', 'watermarkOrigin', 'logos', 'logos'],
	['markw', 'watermarkWidth', '20w', '20w'],
	['markh', 'watermarkHeight', '10h', '10h'],
	['markfit', 'watermarkFit', 'crop', 'crop'],
	['markfp', 'watermarkFocalPoint', '20p:20p', '20p:20p'],
	['markzoom', 'watermarkZoom', 2, '2'],
	['markpad', 'watermarkPadding', '10:20', '10:20'],
	['markpos', 'watermarkPosition', '10p:20p', '10p:20p'],
	['markalpha', 'watermarkAlpha', 50, '50'],
	['bg', 'background', 'lavender', 'lavender'],
	['border', 'border', '2p,fff,expand', '2p,fff,expand'],
	['q', 'quality', 80, '80'],
	['fm', 'format', 'avif', 'avif'],
	['interlace', 'interlaced', true, '1'],
	['fp', 'focalPoint', '10p:20p', '10p:20p'],
	['zoom', 'zoom', 'facesarea,2.5', 'facesarea,2.5'],
	['zoompad', 'zoomPadding', '5p:10p', '5p:10p'],
	['face', 'face', 2, '2'],
	['debug', 'debug', true, '1'],
	['passthrough', 'passthrough', true, '1'],
];

describe('PHP constructor and getter cases', () => {
	test.each(parameters)(
		'%s / %s constructors and getters',
		(key, name, value, serialized) => {
			for (const inputName of new Set([key, name])) {
				const options = new Options({ [inputName]: value });

				expect(options.get(key)).toBe(serialized);

				expect(options.get(name)).toBe(serialized);

				expect(options.toObject()).toEqual({ [key]: serialized });

				expect(builder.buildUrl('bird.jpg', options)).toBe(
					'https://images.example.com/bird.jpg?' + key + '=' + serialized,
				);
			}
		},
	);

	test('sets options with individual setters', () => {
		const options = new Options()
			.setWidth(300)
			.setHeight(400)
			.setFit('fill')
			.setWatermarkPosition('center');

		expect(options.toObject()).toEqual({
			w: '300',
			h: '400',
			fit: 'fill',
			markpos: 'center',
		});

		expect(builder.buildUrl('bird.jpg', options)).toBe(
			'https://images.example.com/bird.jpg?fit=fill&h=400&markpos=center&w=300',
		);
	});

	test('initializes compound constructor options with positional arrays', () => {
		const options = new Options({
			width: 300,
			height: 400,
			fit: 'fill',
			watermarkPosition: 'center',
			border: [10, '000000', 'overlay'],
		});

		expect(builder.buildUrl('bird.jpg', options)).toBe(
			'https://images.example.com/bird.jpg?border=10,000000,overlay&fit=fill&h=400&markpos=center&w=300',
		);
	});

	test('handles complex options', () => {
		const options = new Options()
			.setSharpen(5)
			.setFit('fill')
			.setWatermarkPosition('center')
			.setWatermarkAlpha(50)
			.setQuality(80)
			.setFormat('png')
			.setBorder(10, '000000', 'overlay');

		expect(builder.buildUrl('bird.jpg', options)).toBe(
			'https://images.example.com/bird.jpg?border=10,000000,overlay&fit=fill&fm=png&markalpha=50&markpos=center&q=80&sharp=5',
		);
	});

	test.each([true, false])(
		'serializes boolean %s through getters and URLs',
		(value) => {
			const options = new Options()
				.setInterlaced(value)
				.setDebug(value)
				.setParam('enabled', value);

			const expected = value ? '1' : '0';

			expect(options.get('interlaced')).toBe(expected);

			expect(options.get('debug')).toBe(expected);

			expect(options.get('enabled')).toBe(expected);

			expect(builder.buildUrl('bird.jpg', options)).toBe(
				'https://images.example.com/bird.jpg?debug=' +
					expected +
					'&enabled=' +
					expected +
					'&interlace=' +
					expected,
			);
		},
	);

	test('rounds a dividend and divisor to four decimal places', () => {
		const options = new Options();

		options.setAspectRatio(19, 6);

		expect(options.get('aspectRatio')).toBe('3.1667');

		expect(builder.buildUrl('bird.jpg', options)).toBe(
			'https://images.example.com/bird.jpg?ar=3.1667',
		);
	});

	test.each([1.7778, '16:9'])('accepts direct aspect ratio %s', (value) => {
		const options = new Options();

		options.setAspectRatio(value);

		expect(options.get('ar')).toBe(String(value));
	});

	test('retains the existing JS aspect-ratio tuple representation', () => {
		const options = new Options({ aspectRatio: [19, 6] });

		expect(options.get('aspectRatio')).toBe('19:6');

		expect(builder.buildUrl('bird.jpg', options)).toBe(
			'https://images.example.com/bird.jpg?ar=19:6',
		);
	});

	test('sets ad hoc parameters through the setter and constructor APIs', () => {
		const fluent = new Options()
			.setWidth(100)
			.setParam('my-other-param', 'whatever')
			.setParams({ version: 2, enabled: true });

		const constructed = new Options({
			width: 100,
			'my-other-param': 'whatever',
			version: 2,
			enabled: true,
		});

		for (const options of [fluent, constructed]) {
			expect(options.get('my-other-param')).toBe('whatever');

			expect(builder.buildUrl('bird.jpg', options)).toBe(
				'https://images.example.com/bird.jpg?enabled=1&my-other-param=whatever&version=2&w=100',
			);
		}
	});

	test('reads watermark values through the generic getter', () => {
		const options = new Options()
			.setWatermarkPath('/path/to/watermark.png')
			.setWatermarkPosition('center')
			.setWatermarkAlpha(50);

		expect(options.get('watermarkPath')).toBe('/path/to/watermark.png');

		expect(options.get('watermarkPosition')).toBe('center');

		expect(options.get('watermarkAlpha')).toBe('50');
	});

	test('reads basic dimensions, quality, and format', () => {
		const options = new Options()
			.setWidth(300)
			.setHeight(400)
			.setQuality(85)
			.setFormat('webp');

		expect(options.get('width')).toBe('300');

		expect(options.get('height')).toBe('400');

		expect(options.get('quality')).toBe('85');

		expect(options.get('format')).toBe('webp');
	});

	test('normalizes jpeg through setters and constructor aliases', () => {
		const fluent = new Options();

		fluent.setFormat('jpeg');

		for (const options of [
			fluent,
			new Options({ format: 'jpeg' }),
			new Options({ fm: 'jpeg' }),
		]) {
			expect(options.get('format')).toBe('jpg');

			expect(builder.buildUrl('bird.jpg', options)).toBe(
				'https://images.example.com/bird.jpg?fm=jpg',
			);
		}
	});

	test('reads filters and enhancements', () => {
		const options = new Options()
			.setFilter('grayscale')
			.setBrightness(10)
			.setContrast(15)
			.setGamma(1.2)
			.setSharpen(3)
			.setBlur(2)
			.setPixelate(5);

		expect(options.get('filter')).toBe('grayscale');

		expect(options.get('brightness')).toBe('10');

		expect(options.get('contrast')).toBe('15');

		expect(options.get('gamma')).toBe('1.2');

		expect(options.get('sharpen')).toBe('3');

		expect(options.get('blur')).toBe('2');

		expect(options.get('pixelate')).toBe('5');
	});

	test('reads crop, fit, background, and border values', () => {
		const options = new Options()
			.setCrop(100, 200, 10, 20)
			.setFit('contain')
			.setBackground('ffffff')
			.setBorder(5, 'ff0000', 'overlay');

		expect(options.get('crop')).toBe('100,200,10,20');

		expect(options.get('fit')).toBe('contain');

		expect(options.get('background')).toBe('ffffff');

		expect(options.get('border')).toBe('5,ff0000,overlay');
	});

	test.each(['contain', 'max', 'fill', 'fill-max', 'stretch', 'crop'])(
		'accepts fit string %s for image and watermark',
		(fit) => {
			const options = new Options();

			options.setFit(fit);

			options.setWatermarkFit(fit);

			expect(options.get('fit')).toBe(fit);

			expect(options.get('watermarkFit')).toBe(fit);

			expect(builder.buildUrl('bird.jpg', options)).toBe(
				'https://images.example.com/bird.jpg?fit=' + fit + '&markfit=' + fit,
			);
		},
	);

	test.each([
		['setFit', 'crop=top&fit=crop&fp=25p:75p&zoom=2'],
		['setWatermarkFit', 'crop=top&fp=25p:75p&markfit=crop&zoom=2'],
	] as const)(
		'%s emits separate crop, focal point, and zoom parameters',
		(setter, query) => {
			const options = new Options();

			options[setter]('crop')
				.setCropPosition('top')
				.setFocalPoint('25p', '75p')
				.setZoom(2);

			expect(builder.buildUrl('bird.jpg', options)).toBe(
				'https://images.example.com/bird.jpg?' + query,
			);
		},
	);
});

describe('PHP current-parameter cases', () => {
	test('entropy crops generate the same URL through constructor and named setters', () => {
		const cropPosition = new Options()
			.setFit('crop')
			.setCropPosition('entropy')
			.setWidth(300)
			.setHeight(200);

		const crop = new Options()
			.setFit('crop')
			.setCrop('entropy')
			.setWidth(300)
			.setHeight(200);

		const constructed = new Options({
			fit: 'crop',
			crop: 'entropy',
			w: 300,
			h: 200,
		});

		for (const options of [cropPosition, crop, constructed]) {
			expect(options.get('crop')).toBe('entropy');

			expect(options.get('cropPosition')).toBe('entropy');

			expect(builder.buildUrl('photo.jpg', options)).toBe(
				'https://images.example.com/photo.jpg?crop=entropy&fit=crop&h=200&w=300',
			);
		}
	});

	test('returns mixed current parameters and updates crop values', () => {
		const options = new Options({
			w: '65p',
			height: 12.5,
			ar: '16:9',
			dpr: 1.5,
			crop: 'face,top',
			fp: '25w:75h',
			zoom: 'face,2.5',
			zoompad: '10:20',
			face: 2,
			debug: true,
			markpos: '10p:20p',
			markpad: '5:10',
			pixel: 8,
		});

		expect(options.get('w')).toBe('65p');

		expect(options.get('h')).toBe('12.5');

		expect(options.get('dpr')).toBe('1.5');

		expect(options.get('cropPosition')).toBe('face,top');

		expect(options.get('watermarkPosition')).toBe('10p:20p');

		expect(options.get('pixelate')).toBe('8');

		options.setCrop(100, 80, 10, 20);

		expect(options.get('crop')).toBe('100,80,10,20');

		options.setCropPosition('top');

		expect(options.get('crop')).toBe('top');
	});

	test('passthrough uses presence, while the named setter removes false', () => {
		const options = new Options({ passthrough: true, w: 200 });

		expect(builder.buildUrl('logo.svg', options)).toBe(
			'https://images.example.com/logo.svg?passthrough=1&w=200',
		);

		options.setPassthrough(false);

		expect(builder.buildUrl('logo.svg', options)).toBe(
			'https://images.example.com/logo.svg?w=200',
		);

		expect(
			builder.buildUrl('logo.svg', new Options({ passthrough: false })),
		).toBe('https://images.example.com/logo.svg');

		options.setParam('passthrough', '0');

		expect(builder.buildUrl('logo.svg', options)).toBe(
			'https://images.example.com/logo.svg?passthrough=0&w=200',
		);
	});

	for (const [setter, name, key] of [
		['setWidth', 'width', 'w'],
		['setHeight', 'height', 'h'],
		['setWatermarkWidth', 'watermarkWidth', 'markw'],
		['setWatermarkHeight', 'watermarkHeight', 'markh'],
		['setWatermarkPadding', 'watermarkPadding', 'markpad'],
	] as const) {
		test.each([100, 12.5, '65p', '20w', '30h'])(
			setter + ' preserves %s in getters and URLs',
			(value) => {
				const options = new Options();

				options[setter](value);

				expect(options.get(name)).toBe(String(value));

				expect(options.get(key)).toBe(String(value));

				expect(builder.buildUrl('bird.jpg', options)).toBe(
					'https://images.example.com/bird.jpg?' + key + '=' + value,
				);
			},
		);
	}

	test('combines compound and numeric values using the PHP fixture', () => {
		const options = new Options()
			.setWidth('65p')
			.setHeight(12.5)
			.setAspectRatio('16:9')
			.setDevicePixelRatio(1.5)
			.setWatermarkPosition(12.5)
			.setWatermarkPadding('5p:10h')
			.setBorder(2.5, 'fff', 'overlay');

		expect(options.get('devicePixelRatio')).toBe('1.5');

		expect(options.get('aspectRatio')).toBe('16:9');

		expect(options.get('watermarkPosition')).toBe('12.5');

		expect(builder.buildUrl('bird.jpg', options)).toBe(
			'https://images.example.com/bird.jpg?ar=16:9&border=2.5,fff,overlay&dpr=1.5&h=12.5&markpad=5p:10h&markpos=12.5&w=65p',
		);

		for (const value of ['top', 'face,top', 'facesarea,bottom']) {
			options.setCrop(value);

			expect(options.get('crop')).toBe(value);
		}

		options.setCrop(100, 80, 10, 20);

		expect(options.get('crop')).toBe('100,80,10,20');
	});
});
