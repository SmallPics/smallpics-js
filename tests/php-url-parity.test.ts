import { test, expect } from 'vitest';
import { Options, UrlBuilder } from '../dist/index.js';
import { signUrl } from '../dist/server.js';

// Ported from smallpics-php/tests/Unit/UrlBuilderTest.php.
// Expected URLs and signatures are literal PHP fixtures.
// JS signs asynchronously through signUrl and uses undefined for omitted options.

test('can build basic URL', async () => {
	const options = new Options({
		width: 300,
		height: 400,
		fit: 'fill',
		watermarkPosition: 'center',
	});

	const builder = new UrlBuilder('https://images.example.com');

	const url = builder.buildUrl('images/image.jpg', options);

	expect(url).toBe(
		'https://images.example.com/images/image.jpg?fit=fill&h=400&markpos=center&w=300',
	);
});

test('can build a basic URL without any options', async () => {
	const options = new Options();

	const builder = new UrlBuilder('https://images.example.com');

	const url = builder.buildUrl('images/image.jpg', options);

	expect(url).toBe('https://images.example.com/images/image.jpg');
});

test('can build URL with omitted options (PHP null-options equivalent)', async () => {
	const builder = new UrlBuilder('https://images.example.com');

	const url = builder.buildUrl('images/image.jpg', undefined);

	expect(url).toBe('https://images.example.com/images/image.jpg');
});

test('can handle URLs with leading/trailing slashes', async () => {
	const options = new Options({
		width: 300,
	});

	const builder = new UrlBuilder('https://images.example.com');

	const url = builder.buildUrl('/images/image.jpg/', options);

	expect(url).toBe('https://images.example.com/images/image.jpg?w=300');
});

test('can build URL with quality and format options', async () => {
	const options = new Options({
		width: 300,
		height: 400,
		quality: 85,
		format: 'webp',
	});

	const builder = new UrlBuilder('https://images.example.com');

	const url = builder.buildUrl('images/image.jpg', options);

	expect(url).toBe(
		'https://images.example.com/images/image.jpg?fm=webp&h=400&q=85&w=300',
	);
});

test('can build URL with watermark options', async () => {
	const options = new Options({
		width: 300,
		height: 400,
		watermarkPosition: 'center',
		watermarkAlpha: 50,
	});

	const builder = new UrlBuilder('https://images.example.com');

	const url = builder.buildUrl('images/image.jpg', options);

	expect(url).toBe(
		'https://images.example.com/images/image.jpg?h=400&markalpha=50&markpos=center&w=300',
	);
});

test('can build URL with enhancement options', async () => {
	const options = new Options({
		width: 300,
		height: 400,
		brightness: 10,
		contrast: 15,
		sharpen: 3,
		blur: 2,
	});

	const builder = new UrlBuilder('https://images.example.com');

	const url = builder.buildUrl('images/image.jpg', options);

	expect(url).toBe(
		'https://images.example.com/images/image.jpg?blur=2&bri=10&con=15&h=400&sharp=3&w=300',
	);
});

test('can build URL with filter options', async () => {
	const options = new Options({
		width: 300,
		height: 400,
		filter: 'grayscale',
	});

	const builder = new UrlBuilder('https://images.example.com');

	const url = builder.buildUrl('images/image.jpg', options);

	expect(url).toBe(
		'https://images.example.com/images/image.jpg?filt=grayscale&h=400&w=300',
	);
});

test('can build URL with crop options', async () => {
	const options = new Options();

	options.setCrop(100, 200, 10, 20);

	const builder = new UrlBuilder('https://images.example.com');

	const url = builder.buildUrl('images/image.jpg', options);

	expect(url).toBe(
		'https://images.example.com/images/image.jpg?crop=100,200,10,20',
	);
});

test('can build URL with background and border options', async () => {
	const options = new Options();

	// prettier-ignore
	options.setBackground('ffffff')
		.setBorder(5, 'ff0000', 'overlay');

	const builder = new UrlBuilder('https://images.example.com');

	const url = builder.buildUrl('images/image.jpg', options);

	expect(url).toBe(
		'https://images.example.com/images/image.jpg?bg=ffffff&border=5,ff0000,overlay',
	);
});

test('can build URL with boolean options', async () => {
	const options = new Options();

	options.setInterlaced(true);

	const builder = new UrlBuilder('https://images.example.com');

	const url = builder.buildUrl('images/image.jpg', options);

	expect(url).toBe('https://images.example.com/images/image.jpg?interlace=1');
});

test('can build URL with fit options', async () => {
	const options = new Options();

	options.setFit('contain');

	const builder = new UrlBuilder('https://images.example.com');

	const url = builder.buildUrl('images/image.jpg', options);

	expect(url).toBe('https://images.example.com/images/image.jpg?fit=contain');
});

test('can build URL with aspect ratio', async () => {
	const options = new Options();

	options.setAspectRatio(19, 6);

	const builder = new UrlBuilder('https://images.example.com');

	const url = builder.buildUrl('images/image.jpg', options);

	expect(url).toBe('https://images.example.com/images/image.jpg?ar=3.1667');
});

test('can build URL with orientation and flip options', async () => {
	const options = new Options();

	// prettier-ignore
	options.setOrientation(90)
		.setFlip('h');

	const builder = new UrlBuilder('https://images.example.com');

	const url = builder.buildUrl('images/image.jpg', options);

	expect(url).toBe('https://images.example.com/images/image.jpg?flip=h&or=90');
});

test('can build URL with device pixel ratio', async () => {
	const options = new Options();

	options.setDevicePixelRatio(2);

	const builder = new UrlBuilder('https://images.example.com');

	const url = builder.buildUrl('images/image.jpg', options);

	expect(url).toBe('https://images.example.com/images/image.jpg?dpr=2');
});

test('can build URL with ad hoc params', async () => {
	const options = new Options();

	// prettier-ignore
	options.setWidth(100)
		.setParam('my-other-param', 'foobar');

	const builder = new UrlBuilder('https://images.example.com');

	const url = builder.buildUrl('images/image.jpg', options);

	expect(url).toBe(
		'https://images.example.com/images/image.jpg?my-other-param=foobar&w=100',
	);
});

test('can build URL with gamma adjustment', async () => {
	const options = new Options();

	options.setGamma(1.5);

	const builder = new UrlBuilder('https://images.example.com');

	const url = builder.buildUrl('images/image.jpg', options);

	expect(url).toBe('https://images.example.com/images/image.jpg?gam=1.5');
});

test('can build URL with pixelate effect', async () => {
	const options = new Options();

	options.setPixelate(10);

	const builder = new UrlBuilder('https://images.example.com');

	const url = builder.buildUrl('images/image.jpg', options);

	expect(url).toBe('https://images.example.com/images/image.jpg?pixel=10');
});

test('can build URL with watermark path', async () => {
	const options = new Options();

	options.setWatermarkPath('/watermarks/logo.png');

	const builder = new UrlBuilder('https://images.example.com');

	const url = builder.buildUrl('images/image.jpg', options);

	expect(url).toBe(
		'https://images.example.com/images/image.jpg?mark=/watermarks/logo.png',
	);
});

test('can build URL with watermark dimensions', async () => {
	const options = new Options();

	// prettier-ignore
	options.setWatermarkWidth(100)
		.setWatermarkHeight(50);

	const builder = new UrlBuilder('https://images.example.com');

	const url = builder.buildUrl('images/image.jpg', options);

	expect(url).toBe(
		'https://images.example.com/images/image.jpg?markh=50&markw=100',
	);
});

test('can build URL with watermark coordinates and padding', async () => {
	const options = new Options();

	// prettier-ignore
	options.setWatermarkPosition('10:20')
		.setWatermarkPadding('5:10');

	const builder = new UrlBuilder('https://images.example.com');

	expect(builder.buildUrl('images/image.jpg', options)).toBe(
		'https://images.example.com/images/image.jpg?markpad=5:10&markpos=10:20',
	);
});

test('can build URL with watermark fit', async () => {
	const options = new Options();

	options.setWatermarkFit('contain');

	const builder = new UrlBuilder('https://images.example.com');

	const url = builder.buildUrl('images/image.jpg', options);

	expect(url).toBe(
		'https://images.example.com/images/image.jpg?markfit=contain',
	);
});

test('can generate signed URLs', async () => {
	const options = new Options({
		width: 300,
		height: 400,
	});

	const secret = 'my-secret-value';

	const builder = new UrlBuilder('https://images.example.com');

	const url = await signUrl(
		builder.buildUrl('images/image.jpg', options),
		secret,
	);

	expect(url).toBe(
		'https://images.example.com/images/image.jpg?h=400&w=300&s=zUweQjgXXIPf89xQ6ZwWKiR6oaKLrb8uY3NZWQz7xCY',
	);
});

test('can generate signed URLs with ad hoc params', async () => {
	const options = new Options();

	// prettier-ignore
	options.setWidth(100)
		.setParam('my-other-param', 'whatever');

	const secret = 'my-secret-value';

	const builder = new UrlBuilder('https://images.example.com');

	const url = await signUrl(
		builder.buildUrl('images/image.jpg', options),
		secret,
	);

	expect(url).toBe(
		'https://images.example.com/images/image.jpg?my-other-param=whatever&w=100&s=XZus9dOfF8Pw0Y6A0Nqwr9mOmYZaDRHCgwKkx6iYFg',
	);
});

test('can generate complex signed URLs', async () => {
	const options = new Options();

	// prettier-ignore
	options.setBorder(5, 'ff0000', 'overlay')
		.setQuality(80)
		.setFormat('png');

	const secret = 'my-secret-value';

	const builder = new UrlBuilder('https://images.example.com');

	const url = await signUrl(
		builder.buildUrl('images/image.jpg', options),
		secret,
	);

	expect(url).toBe(
		'https://images.example.com/images/image.jpg?border=5,ff0000,overlay&fm=png&q=80&s=aENMpKwCgmLFxdo1KipXNVWsNvmOMbgxa6pGRI',
	);
});

test('generates signature with unicode characters', async () => {
	const options = new Options()
		.setFormat('avif')
		.setQuality(90)
		.setWidth(600)
		.setHeight(600)
		.setFit('contain');

	const secret = 'my-secret-value';

	const builder = new UrlBuilder('https://images.example.com');

	const url = await signUrl(
		builder.buildUrl('images/unicode-%E9%BD%90%E8%89%B2-0.png', options),
		secret,
	);

	expect(url).toBe(
		'https://images.example.com/images/unicode-%E9%BD%90%E8%89%B2-0.png?fit=contain&fm=avif&h=600&q=90&w=600&s=QdTpLQU32MvZqPpWTHupc6foZ3EHeVCLf2R1y6RW3U',
	);
});
