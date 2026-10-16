import { describe, expect, test } from 'vitest';
import { Options, UrlBuilder } from '../dist/index.js';

describe('PHP-style fluent setters', () => {
	test('setOrientation is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setOrientation(90)).toBe(options);

		expect(options.toObject()).toEqual({ or: '90' });
	});

	test('setFlip is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setFlip('h')).toBe(options);

		expect(options.toObject()).toEqual({ flip: 'h' });
	});

	test('setCrop is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setCrop(400, 300, 10, 20)).toBe(options);

		expect(options.toObject()).toEqual({ crop: '400,300,10,20' });
	});

	test('setCropPosition is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setCropPosition('top')).toBe(options);

		expect(options.toObject()).toEqual({ crop: 'top' });
	});

	test('setFocalPoint is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setFocalPoint('25w', '75h')).toBe(options);

		expect(options.toObject()).toEqual({ fp: '25w:75h' });
	});

	test('setZoom is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setZoom('face', 2.5)).toBe(options);

		expect(options.toObject()).toEqual({ zoom: 'face,2.5' });
	});

	test('setZoomPadding is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setZoomPadding(10, 20)).toBe(options);

		expect(options.toObject()).toEqual({ zoompad: '10:20' });
	});

	test('setFace is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setFace(1)).toBe(options);

		expect(options.toObject()).toEqual({ face: '1' });
	});

	test('setDebug is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setDebug(true)).toBe(options);

		expect(options.toObject()).toEqual({ debug: '1' });
	});

	test('setPassthrough is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setPassthrough(true)).toBe(options);

		expect(options.toObject()).toEqual({ passthrough: '1' });
	});

	test('setWidth is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setWidth(800)).toBe(options);

		expect(options.toObject()).toEqual({ w: '800' });
	});

	test('setHeight is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setHeight(600)).toBe(options);

		expect(options.toObject()).toEqual({ h: '600' });
	});

	test('setAspectRatio is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setAspectRatio(16, 9)).toBe(options);

		expect(options.toObject()).toEqual({ ar: '1.7778' });
	});

	test('setFit is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setFit('crop')).toBe(options);

		expect(options.toObject()).toEqual({ fit: 'crop' });
	});

	test('setDevicePixelRatio is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setDevicePixelRatio(1.5)).toBe(options);

		expect(options.toObject()).toEqual({ dpr: '1.5' });
	});

	test('setBrightness is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setBrightness(10)).toBe(options);

		expect(options.toObject()).toEqual({ bri: '10' });
	});

	test('setContrast is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setContrast(15)).toBe(options);

		expect(options.toObject()).toEqual({ con: '15' });
	});

	test('setGamma is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setGamma(1.2)).toBe(options);

		expect(options.toObject()).toEqual({ gam: '1.2' });
	});

	test('setSharpen is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setSharpen(20)).toBe(options);

		expect(options.toObject()).toEqual({ sharp: '20' });
	});

	test('setBlur is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setBlur(5)).toBe(options);

		expect(options.toObject()).toEqual({ blur: '5' });
	});

	test('setPixelate is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setPixelate(8)).toBe(options);

		expect(options.toObject()).toEqual({ pixel: '8' });
	});

	test('setFilter is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setFilter('grayscale')).toBe(options);

		expect(options.toObject()).toEqual({ filt: 'grayscale' });
	});

	test('setWatermarkPath is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setWatermarkPath('bird.jpg')).toBe(options);

		expect(options.toObject()).toEqual({ mark: 'bird.jpg' });
	});

	test('setWatermarkOrigin is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setWatermarkOrigin('default')).toBe(options);

		expect(options.toObject()).toEqual({ markorigin: 'default' });
	});

	test('setWatermarkWidth is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setWatermarkWidth(80)).toBe(options);

		expect(options.toObject()).toEqual({ markw: '80' });
	});

	test('setWatermarkHeight is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setWatermarkHeight(80)).toBe(options);

		expect(options.toObject()).toEqual({ markh: '80' });
	});

	test('setWatermarkFit is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setWatermarkFit('crop')).toBe(options);

		expect(options.toObject()).toEqual({ markfit: 'crop' });
	});

	test('setWatermarkFocalPoint is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setWatermarkFocalPoint('20p', '20p')).toBe(options);

		expect(options.toObject()).toEqual({ markfp: '20p:20p' });
	});

	test('setWatermarkZoom is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setWatermarkZoom(2)).toBe(options);

		expect(options.toObject()).toEqual({ markzoom: '2' });
	});

	test('setWatermarkPadding is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setWatermarkPadding(16)).toBe(options);

		expect(options.toObject()).toEqual({ markpad: '16' });
	});

	test('setWatermarkPosition is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setWatermarkPosition('center')).toBe(options);

		expect(options.toObject()).toEqual({ markpos: 'center' });
	});

	test('setWatermarkAlpha is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setWatermarkAlpha(80)).toBe(options);

		expect(options.toObject()).toEqual({ markalpha: '80' });
	});

	test('setBackground is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setBackground('ffffff')).toBe(options);

		expect(options.toObject()).toEqual({ bg: 'ffffff' });
	});

	test('setBorder is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setBorder(8, 'ffffff', 'expand')).toBe(options);

		expect(options.toObject()).toEqual({ border: '8,ffffff,expand' });
	});

	test('setQuality is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setQuality(80)).toBe(options);

		expect(options.toObject()).toEqual({ q: '80' });
	});

	test('setFormat is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setFormat('avif')).toBe(options);

		expect(options.toObject()).toEqual({ fm: 'avif' });
	});

	test('setInterlaced is chainable and serializes the PHP value', () => {
		const options = new Options();

		expect(options.setInterlaced(true)).toBe(options);

		expect(options.toObject()).toEqual({ interlace: '1' });
	});

	test('uses the watermark chain from the PHP README', () => {
		const options = new Options()
			.setWatermarkPath('bird.jpg')
			.setWatermarkWidth(80)
			.setWatermarkHeight(80)
			.setWatermarkFit('crop')
			.setWatermarkFocalPoint('20p', '20p')
			.setWatermarkZoom(2)
			.setWatermarkPosition('center');

		const builder = new UrlBuilder('https://images.example.com');

		expect(builder.buildUrl('bird.jpg', options)).toBe(
			'https://images.example.com/bird.jpg?mark=bird.jpg&markfit=crop&markfp=20p:20p&markh=80&markpos=center&markw=80&markzoom=2',
		);
	});

	test('handles optional arguments and passthrough removal', () => {
		const options = new Options()
			.setDevicePixelRatio()
			.setPassthrough()
			.setFocalPoint('25p:75p')
			.setZoom('face')
			.setZoomPadding('5p:10p')
			.setWatermarkFocalPoint('20p:20p')
			.setAspectRatio('16:9')
			.setCrop('entropy');

		expect(options.toObject()).toEqual({
			dpr: '1',
			passthrough: '1',
			fp: '25p:75p',
			zoom: 'face',
			zoompad: '5p:10p',
			markfp: '20p:20p',
			ar: '16:9',
			crop: 'entropy',
		});

		options.setPassthrough(false);

		expect(
			new UrlBuilder('https://images.example.com').buildUrl(
				'logo.svg',
				options,
			),
		).not.toContain('passthrough');
	});

	test('normalizes aliases and rejects invalid compound and enum values', () => {
		// prettier-ignore
		const options = new Options().setFormat('JPEG')
			.setFilter('greyscale');

		expect(options.toObject()).toEqual({ fm: 'jpg', filt: 'grayscale' });

		expect(() => options.setCrop(400, 300)).toThrow();

		expect(() => options.setCrop(1.5, 2, 3, 4)).toThrow();

		expect(() => options.setAspectRatio(16, 0)).toThrow();

		expect(() => options.setFit('invalid')).toThrow();

		expect(() => options.setWatermarkFit('invalid')).toThrow();

		expect(() => options.setFormat('invalid')).toThrow();

		expect(() => options.setFilter('invalid')).toThrow();

		expect(() => options.setBorder(2, 'fff', 'invalid')).toThrow();
	});

	test('supports raw parameter setters and preserves the presence flag', () => {
		const options = new Options();

		expect(options.setParam('custom', true)).toBe(options);

		expect(options.setParams({ another: 2, disabled: false })).toBe(options);

		options.setParam('passthrough', false);

		expect(options.toObject()).toEqual({
			custom: '1',
			another: '2',
			disabled: '0',
			passthrough: '0',
		});
	});
});
