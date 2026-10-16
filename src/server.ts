/** Server-only signing, compatible with the PHP SDK and Small Pics verifier. */
export async function signUrl(value: string, secret: string): Promise<string> {
	if (typeof window !== 'undefined') {
		throw new Error('Signing secrets must not be used in a browser.');
	}

	if (!secret) {
		throw new TypeError('A non-empty signing secret is required.');
	}

	const url = new URL(value);

	if (
		!['https:', 'http:'].includes(url.protocol) ||
		url.username ||
		url.password
	) {
		throw new TypeError('Expected an HTTP(S) delivery URL.');
	}

	const params = new Map<string, string>();

	for (const [key, value] of url.searchParams) {
		if (!['s', 'signature'].includes(key.toLowerCase())) {
			params.set(key.toLowerCase(), value);
		}
	}

	const entries = [...params].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));

	// Query values have already been decoded by URLSearchParams. The legacy
	// verifier decodes the rebuilt query and then the complete signing string.
	const percentDecode = (value: string) =>
		value.replace(/(?:%[\da-f]{2})+/gi, (part) =>
			new TextDecoder().decode(
				Uint8Array.from(part.match(/%([\da-f]{2})/gi)!, (hex) =>
					parseInt(hex.slice(1), 16),
				),
			),
		);

	// prettier-ignore
	const query = entries.map(([key, value]) => `${key}=${value}`)
		.join('&');

	const canonical = percentDecode(
		`${url.protocol}//${url.hostname}${url.pathname}${query ? '?' + percentDecode(query) : ''}`,
	);

	const encoder = new TextEncoder();

	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign'],
	);

	const bytes = new Uint8Array(
		await crypto.subtle.sign('HMAC', key, encoder.encode(canonical)),
	);

	const signature = btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, '');

	const encode = (value: string) =>
		encodeURIComponent(value)
			.replace(/%2C/gi, ',')
			.replace(/%3A/gi, ':')
			.replace(/%2F/gi, '/');

	const encodedQuery = entries
		.map(([key, value]) => `${encode(key)}=${encode(value)}`)
		.join('&');

	const unsigned = `${url.origin}${url.pathname}${encodedQuery ? '?' + encodedQuery : ''}`;

	return `${unsigned}${encodedQuery ? '&' : '?'}s=${signature}`;
}
