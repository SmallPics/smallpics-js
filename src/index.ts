import { normalizeOptions, type OptionsInput } from './options.js';

export * from './options.js';

export function deliveryUrl(value: string): string {
	const url = new URL(value);

	if (
		!['http:', 'https:'].includes(url.protocol) ||
		url.username ||
		url.password ||
		url.search ||
		url.hash
	) {
		throw new TypeError(
			'Small Pics baseUrl must be an HTTP(S) URL without credentials, query or fragment.',
		);
	}

	return url.href.replace(/\/+$/, '');
}

function encodeValue(value: string): string {
	return encodeURIComponent(value)
		.replace(/%2C/gi, ',')
		.replace(/%3A/gi, ':')
		.replace(/%2F/gi, '/');
}

/** Builds delivery URLs. Source paths are relative to the configured Small Pics origin. */
export class UrlBuilder {
	readonly baseUrl: string;

	private defaults: Record<string, string | null>;

	constructor(baseUrl: string, defaults: OptionsInput = {}) {
		this.baseUrl = deliveryUrl(baseUrl);

		this.defaults = normalizeOptions(defaults);
	}

	buildUrl(sourcePath: string, options: OptionsInput = {}): string {
		if (
			/^[a-z][a-z\d+.-]*:/i.test(sourcePath) ||
			sourcePath.startsWith('//') ||
			sourcePath.includes('\\') ||
			sourcePath.includes('#')
		) {
			throw new TypeError(
				'Expected a source path, not an absolute URL or fragment.',
			);
		}

		const index = sourcePath.indexOf('?');

		const path = (index < 0 ? sourcePath : sourcePath.slice(0, index)).replace(
			/^\/+|\/+$/g,
			'',
		);

		if (!path) {
			throw new TypeError('Source path must not be empty.');
		}

		const encoded = path
			.split('/')
			.map((segment) => {
				const decoded = decodeURIComponent(segment);

				if (
					decoded === '.' ||
					decoded === '..' ||
					decoded.includes('/') ||
					decoded.includes('\\')
				) {
					throw new TypeError(
						'Source path must not contain traversal segments.',
					);
				}

				return encodeURIComponent(decoded);
			})
			.join('/');

		const query: Record<string, string | null> = Object.create(null);

		for (const [key, value] of new URLSearchParams(
			index < 0 ? '' : sourcePath.slice(index + 1),
		)) {
			if (!['s', 'signature'].includes(key.toLowerCase())) {
				query[key.toLowerCase()] = value;
			}
		}

		Object.assign(query, this.defaults, normalizeOptions(options));

		const params = Object.keys(query)
			.sort()
			.filter((key) => query[key] !== null)
			.map((key) => `${encodeValue(key)}=${encodeValue(query[key]!)}`)
			.join('&');

		return `${this.baseUrl}/${encoded}${params ? '?' + params : ''}`;
	}

	buildSrcset(
		sourcePath: string,
		widths: readonly number[],
		options: OptionsInput = {},
	): string {
		const params = { ...this.defaults, ...normalizeOptions(options) };

		const width = Number(params.w),
			height = Number(params.h);

		return [...new Set(widths)]
			.sort((a, b) => a - b)
			.map((w) => {
				if (!Number.isInteger(w) || w <= 0) {
					throw new TypeError('Responsive widths must be positive integers.');
				}

				return `${this.buildUrl(sourcePath, { ...params, w, h: width > 0 && height > 0 ? Math.max(1, Math.round((w * height) / width)) : params.h })} ${w}w`;
			})
			.join(', ');
	}
}
