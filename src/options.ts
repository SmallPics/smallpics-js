/** Long names mirror smallpics-php; native URL keys are also accepted. */
export const aliases = {
	orientation: 'or',
	flip: 'flip',
	crop: 'crop',
	cropPosition: 'crop',
	focalPoint: 'fp',
	zoom: 'zoom',
	zoomPadding: 'zoompad',
	face: 'face',
	debug: 'debug',
	passthrough: 'passthrough',
	width: 'w',
	height: 'h',
	aspectRatio: 'ar',
	fit: 'fit',
	devicePixelRatio: 'dpr',
	brightness: 'bri',
	contrast: 'con',
	gamma: 'gam',
	sharpen: 'sharp',
	blur: 'blur',
	pixelate: 'pixel',
	filter: 'filt',
	watermarkPath: 'mark',
	watermarkOrigin: 'markorigin',
	watermarkWidth: 'markw',
	watermarkHeight: 'markh',
	watermarkFit: 'markfit',
	watermarkFocalPoint: 'markfp',
	watermarkZoom: 'markzoom',
	watermarkPadding: 'markpad',
	watermarkPosition: 'markpos',
	watermarkAlpha: 'markalpha',
	background: 'bg',
	border: 'border',
	trim: 'trim',
	trimColor: 'trim-color',
	trimAlpha: 'trim-alpha',
	trimTolerance: 'trim-tol',
	trimPadding: 'trim-pad',
	trimMeanDifference: 'trim-md',
	trimStandardDeviation: 'trim-sd',
	quality: 'q',
	format: 'fm',
	interlaced: 'interlace',
} as const;

export type Parameter =
	string | number | boolean | readonly (string | number)[] | null | undefined;

export type TransformOptions = Partial<
	Record<keyof typeof aliases, Parameter>
> &
	Record<string, Parameter>;

export type TrimMode = 'auto' | 'color' | 'alpha' | 'either';

export type OptionsInput = TransformOptions | Options;

export type Format =
	| 'auto'
	| 'strict'
	| 'avif'
	| 'webp'
	| 'jpg'
	| 'jpeg'
	| 'pjpg'
	| 'png'
	| 'gif'
	| 'jxl';

export type Fit = 'contain' | 'max' | 'fill' | 'fill-max' | 'stretch' | 'crop';

export function normalizeOptions(
	input: OptionsInput = {},
): Record<string, string | null> {
	if (input instanceof Options) {
		return input.toObject();
	}

	const result: Record<string, string | null> = Object.create(null);

	for (const [name, value] of Object.entries(input)) {
		const key: string = Object.hasOwn(aliases, name)
			? aliases[name as keyof typeof aliases]
			: name.toLowerCase();

		if (!/^[a-z][a-z0-9_-]*$/.test(key)) {
			throw new TypeError(`Invalid transform parameter: ${name}`);
		}

		if (key === 's' || key === 'signature') {
			continue;
		}

		if (value === undefined) {
			continue;
		}

		if (value === null || (key === 'passthrough' && value === false)) {
			result[key] = null;

			continue;
		}

		if (typeof value === 'number' && !Number.isFinite(value)) {
			throw new TypeError(`Invalid number for ${name}`);
		}

		if (
			Array.isArray(value) &&
			value.some(
				(v) =>
					typeof v !== 'string' &&
					(typeof v !== 'number' || !Number.isFinite(v)),
			)
		) {
			throw new TypeError(`Invalid tuple for ${name}`);
		}

		if (typeof value === 'object' && !Array.isArray(value)) {
			throw new TypeError(`Invalid value for ${name}`);
		}

		let normalized = Array.isArray(value)
			? value.join(['fp', 'markfp', 'zoompad', 'ar'].includes(key) ? ':' : ',')
			: typeof value === 'boolean'
				? value
					? '1'
					: '0'
				: String(value);

		if (key === 'fm' && normalized === 'jpeg') {
			normalized = 'jpg';
		}

		if (key === 'filt' && normalized === 'greyscale') {
			normalized = 'grayscale';
		}

		result[key] = normalized;
	}

	return result;
}

/** Mutable fluent options, with null removing a value inherited from defaults. */
export class Options {
	private values: Record<string, string | null>;

	constructor(input: OptionsInput = {}) {
		this.values = normalizeOptions(input);
	}

	set(key: string, value: Parameter): this {
		Object.assign(this.values, normalizeOptions({ [key]: value }));

		return this;
	}

	setOrientation(value: number | string): this {
		return this.set('orientation', value);
	}

	setFlip(value: string): this {
		return this.set('flip', value);
	}

	setCropPosition(value: string): this {
		return this.set('cropPosition', value);
	}

	setFace(value: number): this {
		return this.set('face', value);
	}

	setDebug(value: boolean): this {
		return this.set('debug', value);
	}

	setPassthrough(value: boolean = true): this {
		return this.set('passthrough', value);
	}

	setWidth(value: number | string): this {
		return this.set('width', value);
	}

	setHeight(value: number | string): this {
		return this.set('height', value);
	}

	setFit(value: string): this {
		if (
			!['contain', 'max', 'fill', 'fill-max', 'stretch', 'crop'].includes(value)
		) {
			throw new TypeError('Invalid fit.');
		}

		return this.set('fit', value);
	}

	setDevicePixelRatio(value: number = 1): this {
		return this.set('devicePixelRatio', value);
	}

	setBrightness(value: number): this {
		return this.set('brightness', value);
	}

	setContrast(value: number): this {
		return this.set('contrast', value);
	}

	setGamma(value: number): this {
		return this.set('gamma', value);
	}

	setSharpen(value: number): this {
		return this.set('sharpen', value);
	}

	setBlur(value: number): this {
		return this.set('blur', value);
	}

	setPixelate(value: number): this {
		return this.set('pixelate', value);
	}

	setFilter(value: string): this {
		if (value === 'greyscale') {
			value = 'grayscale';
		}

		if (!['grayscale', 'sepia'].includes(value)) {
			throw new TypeError('Invalid filter.');
		}

		return this.set('filter', value);
	}

	setWatermarkPath(value: string): this {
		return this.set('watermarkPath', value);
	}

	setWatermarkOrigin(value: string): this {
		return this.set('watermarkOrigin', value);
	}

	setWatermarkWidth(value: number | string): this {
		return this.set('watermarkWidth', value);
	}

	setWatermarkHeight(value: number | string): this {
		return this.set('watermarkHeight', value);
	}

	setWatermarkFit(value: string): this {
		if (
			!['contain', 'max', 'fill', 'fill-max', 'stretch', 'crop'].includes(value)
		) {
			throw new TypeError('Invalid watermarkFit.');
		}

		return this.set('watermarkFit', value);
	}

	setWatermarkZoom(value: number | string): this {
		return this.set('watermarkZoom', value);
	}

	setWatermarkPadding(value: number | string): this {
		return this.set('watermarkPadding', value);
	}

	setWatermarkPosition(value: number | string): this {
		return this.set('watermarkPosition', value);
	}

	setWatermarkAlpha(value: number): this {
		return this.set('watermarkAlpha', value);
	}

	setBackground(value: string): this {
		return this.set('background', value);
	}

	setTrim(value: TrimMode): this {
		return this.set('trim', value);
	}

	setTrimColor(value: string): this {
		return this.set('trimColor', value);
	}

	setTrimAlpha(value: number): this {
		return this.set('trimAlpha', value);
	}

	setTrimTolerance(value: number): this {
		return this.set('trimTolerance', value);
	}

	setTrimPadding(value: number | string): this {
		return this.set('trimPadding', value);
	}

	setTrimMeanDifference(value: number): this {
		return this.set('trimMeanDifference', value);
	}

	setTrimStandardDeviation(value: number): this {
		return this.set('trimStandardDeviation', value);
	}

	setQuality(value: number): this {
		return this.set('quality', value);
	}

	setFormat(value: string): this {
		value = value.toLowerCase();

		if (value === 'jpeg') {
			value = 'jpg';
		}

		if (
			![
				'auto',
				'strict',
				'jpg',
				'pjpg',
				'png',
				'gif',
				'webp',
				'avif',
				'jxl',
			].includes(value)
		) {
			throw new TypeError('Invalid format.');
		}

		return this.set('format', value);
	}

	setInterlaced(value: boolean): this {
		return this.set('interlaced', value);
	}

	setFocalPoint(
		value: number | string,
		y: number | string | null = null,
	): this {
		return this.set('focalPoint', y === null ? value : [value, y]);
	}

	setZoomPadding(
		value: number | string,
		y: number | string | null = null,
	): this {
		return this.set('zoomPadding', y === null ? value : [value, y]);
	}

	setWatermarkFocalPoint(
		value: number | string,
		y: number | string | null = null,
	): this {
		return this.set('watermarkFocalPoint', y === null ? value : [value, y]);
	}

	setZoom(value: number | string, fallback: number | null = null): this {
		return this.set('zoom', fallback === null ? value : [value, fallback]);
	}

	setAspectRatio(
		dividend: number | string,
		divisor: number | null = null,
	): this {
		if (divisor === null) {
			return this.set('aspectRatio', dividend);
		}

		if (divisor === 0) {
			throw new TypeError('Aspect ratio divisor must not be zero.');
		}

		return this.set(
			'aspectRatio',
			Math.round((Number(dividend) / divisor) * 10000) / 10000,
		);
	}

	setCrop(
		width: number | string,
		height: number | null = null,
		x: number | null = null,
		y: number | null = null,
	): this {
		if (
			typeof width === 'string' &&
			height === null &&
			x === null &&
			y === null
		) {
			return this.setCropPosition(width);
		}

		if (
			typeof width !== 'number' ||
			height === null ||
			x === null ||
			y === null ||
			![width, height, x, y].every(Number.isInteger)
		) {
			throw new TypeError(
				'Rectangle crops require width, height, x and y integers.',
			);
		}

		return this.set('crop', [width, height, x, y]);
	}

	setBorder(width: number | string, color: string, borderMethod: string): this {
		if (!['overlay', 'shrink', 'expand'].includes(borderMethod)) {
			throw new TypeError('Invalid border method.');
		}

		return this.set('border', [width, color, borderMethod]);
	}

	setParam(key: string, value: number | string | boolean): this {
		return this.set(
			key,
			typeof value === 'boolean' ? (value ? '1' : '0') : value,
		);
	}

	setParams(params: Record<string, number | string | boolean>): this {
		for (const [key, value] of Object.entries(params)) {
			this.setParam(key, value);
		}

		return this;
	}

	get(key: string): string | null | undefined {
		return this.values[
			aliases[key as keyof typeof aliases] ?? key.toLowerCase()
		];
	}

	toObject(): Record<string, string | null> {
		return { ...this.values };
	}
}
