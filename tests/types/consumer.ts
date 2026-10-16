import { UrlBuilder, Options, type TransformOptions } from 'smallpics-js';
import { signUrl } from 'smallpics-js/server';

const options: TransformOptions = {
	width: 800,
	format: 'webp',
	focalPoint: ['25p', '75p'],
};

const url: string = new UrlBuilder('https://media.smallpics.io').buildUrl(
	'bird.jpg',
	new Options(options),
);

const signed: Promise<string> = signUrl(url, 'test-only');

// @ts-expect-error A source path must be a string.
new UrlBuilder('https://media.smallpics.io').buildUrl(42);

void signed;

const fluent: Options = new Options()
	.setWidth(800)
	.setWatermarkPath('bird.jpg')
	.setWatermarkFocalPoint('20p', '20p')
	.setBorder(8, 'ffffff', 'expand');

void fluent;

// @ts-expect-error Watermark widths must be numeric or relative strings.
new Options().setWatermarkWidth(false);

const trim: import('smallpics-js').TrimMode = 'either';
new Options()
	.setTrim(trim)
	.setTrimColor('fff')
	.setTrimAlpha(0)
	.setTrimTolerance(2)
	.setTrimPadding('5p')
	.setTrimMeanDifference(11)
	.setTrimStandardDeviation(10);
// @ts-expect-error The wire spelling intentionally has only one s in unles.
new Options().setTrim('colorunlessalpha');
