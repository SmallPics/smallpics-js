# Small Pics JavaScript

Build image transform URLs for [Small Pics](https://www.smallpics.io) in JavaScript.

## Installation

```sh
npm install @smallpics/smallpics-js
```

## Quick Start

Create an `Options` instance, configure the transform, then pass it with the image path to a `UrlBuilder`.

```js
import { Options, UrlBuilder } from '@smallpics/smallpics-js';

const options = new Options();
options.setWidth(800).setHeight(600).setFit('crop').setQuality(80);

const builder = new UrlBuilder('https://images.example.com');

const url = builder.buildUrl('bird.jpg', options);
// https://images.example.com/bird.jpg?fit=crop&h=600&q=80&w=800
```

The image path may include leading or trailing slashes; they are normalized when the URL is built.

## Signed URLs

Pass the generated URL and your Small Pics signing secret to `signUrl()` in server code. The signature is calculated from the normalized URL and added as `s`.

```js
import { Options, UrlBuilder } from '@smallpics/smallpics-js';
import { signUrl } from '@smallpics/smallpics-js/server';

const options = new Options({
	width: 800,
	height: 600,
});

const builder = new UrlBuilder('https://images.example.com');

const url = await signUrl(
	builder.buildUrl('bird.jpg', options),
	process.env.SMALLPICS_SECRET,
);
// https://images.example.com/bird.jpg?h=600&w=800&s=...
```

Do not commit signing secrets. Load them from your application's environment or secret manager.

## Options

`Options` is a fluent value object that serializes to Small Pics query parameters through `UrlBuilder`.

```js
import { Options, UrlBuilder } from '@smallpics/smallpics-js';

const options = new Options()
	.setWidth(800)
	.setHeight(600)
	.setFit('crop')
	.setCropPosition('top')
	.setFormat('avif');

const builder = new UrlBuilder('https://images.example.com');
console.log(builder.buildUrl('bird.jpg', options));
// https://images.example.com/bird.jpg?crop=top&fit=crop&fm=avif&h=600&w=800
```

### Initialize From an Object

The constructor accepts setter names in camelCase and short query keys such as `w`, `fp`, and `markpad`.

```js
import { Options, UrlBuilder } from '@smallpics/smallpics-js';

const options = new Options({
	width: 800,
	height: 600,
	fit: 'crop',
	crop: 'top',
	border: [8, 'ffffff', 'expand'],
});

const builder = new UrlBuilder('https://images.example.com');
console.log(builder.buildUrl('bird.jpg', options));
// https://images.example.com/bird.jpg?border=8,ffffff,expand&crop=top&fit=crop&h=600&w=800
```

For a raw or future Small Pics query parameter, use `setParam()` or `setParams()`.

```js
options
	.setParam('my-option', 'value')
	.setParam('another-option', 1)
	.setParam('enabled', true);
```

Boolean raw parameters are serialized as `1` or `0`.

### Fixed Values

Options with a fixed set of values use strings.

```js
import { Options } from '@smallpics/smallpics-js';

const options = new Options()
	.setFit('crop')
	.setCropPosition('top')
	.setFormat('avif');
```

See the accepted values for border methods, filters, fits, formats, and watermark positions below.

## Transform Options

Use fluent setters, constructor options, or `setParam()` for serialized query values. Refer to the [Small Pics documentation](https://www.smallpics.io/docs/) for processing behavior and valid ranges.

| Query parameter | Setter                            | Accepted values                                                                            | Example                                  |
| --------------- | --------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------- |
| `or`            | `setOrientation()`                | `0`, `90`, `180`, `270`, or `auto`                                                         | `.setOrientation('auto')`                |
| `flip`          | `setFlip()`                       | `v`, `h`, or `both`                                                                        | `.setFlip('h')`                          |
| `crop`          | `setCrop()` / `setCropPosition()` | Named anchor, `entropy`, `face[,fallback]`, `facesarea[,fallback]`, or width, height, x, y | `.setCrop(400, 300, 10, 20)`             |
| `w`             | `setWidth()`                      | Integer or decimal pixels, or relative dimensions                                          | `.setWidth('65p')`                       |
| `h`             | `setHeight()`                     | Integer or decimal pixels, or relative dimensions                                          | `.setHeight('50w')`                      |
| `ar`            | `setAspectRatio()`                | `width:height`, decimal ratio, or `[width, height]`                                        | `.setAspectRatio(16, 9)`                 |
| `fit`           | `setFit()`                        | See [Fit and Crop Position](#fit-and-crop-position)                                        | `.setFit('crop').setCropPosition('top')` |
| `dpr`           | `setDevicePixelRatio()`           | Integer or decimal                                                                         | `.setDevicePixelRatio(1.5)`              |
| `bri`           | `setBrightness()`                 | Integer brightness                                                                         | `.setBrightness(10)`                     |
| `con`           | `setContrast()`                   | Integer contrast                                                                           | `.setContrast(15)`                       |
| `gam`           | `setGamma()`                      | Float gamma                                                                                | `.setGamma(1.2)`                         |
| `sharp`         | `setSharpen()`                    | Integer sharpen amount                                                                     | `.setSharpen(20)`                        |
| `blur`          | `setBlur()`                       | Integer blur amount                                                                        | `.setBlur(5)`                            |
| `pixel`         | `setPixelate()`                   | Integer pixelate amount                                                                    | `.setPixelate(8)`                        |
| `filt`          | `setFilter()`                     | `grayscale` or `sepia`                                                                     | `.setFilter('grayscale')`                |
| `mark`          | `setWatermarkPath()`              | Watermark image path                                                                       | `.setWatermarkPath('/watermark.png')`    |
| `markorigin`    | `setWatermarkOrigin()`            | Watermark origin name                                                                      | `.setWatermarkOrigin('default')`         |
| `markw`         | `setWatermarkWidth()`             | Integer, decimal, or relative width                                                        | `.setWatermarkWidth('20w')`              |
| `markh`         | `setWatermarkHeight()`            | Integer, decimal, or relative height                                                       | `.setWatermarkHeight('20h')`             |
| `markfit`       | `setWatermarkFit()`               | See [Fit and Crop Position](#fit-and-crop-position)                                        | `.setWatermarkFit('contain')`            |
| `markfp`        | `setWatermarkFocalPoint()`        | Pixels, relative values, or `x:y` within the watermark                                     | `.setWatermarkFocalPoint('20p', '20p')`  |
| `markzoom`      | `setWatermarkZoom()`              | Numeric zoom from `1` to `100`                                                             | `.setWatermarkZoom(2)`                   |
| `markpad`       | `setWatermarkPadding()`           | Pixels, relative values, or `x:y`                                                          | `.setWatermarkPadding(16)`               |
| `markpos`       | `setWatermarkPosition()`          | Named anchor, numeric coordinate, or pixel/relative `x:y` string                           | `.setWatermarkPosition('bottom-right')`  |
| `markalpha`     | `setWatermarkAlpha()`             | Integer alpha                                                                              | `.setWatermarkAlpha(80)`                 |
| `bg`            | `setBackground()`                 | Background color                                                                           | `.setBackground('ffffff')`               |
| `border`        | `setBorder()`                     | Width, color, and method                                                                   | `.setBorder(8, 'ffffff', 'expand')`      |
| `trim`          | `setTrim()`                       | `auto`, `color`, `alpha`, or `either`                                                      | `.setTrim('color')`                      |
| `trim-color`    | `setTrimColor()`                  | Color to remove                                                                            | `.setTrimColor('ffffff')`                |
| `trim-alpha`    | `setTrimAlpha()`                  | Alpha threshold, 0 to 255                                                                  | `.setTrimAlpha(8)`                       |
| `trim-tol`      | `setTrimTolerance()`              | Tolerance, 0 to 255                                                                        | `.setTrimTolerance(8)`                   |
| `trim-pad`      | `setTrimPadding()`                | Padding in pixels or [relative values](#relative-values)                                   | `.setTrimPadding(8)`                     |
| `trim-md`       | `setTrimMeanDifference()`         | Auto mean difference, 0 to 255                                                             | `.setTrimMeanDifference(8)`              |
| `trim-sd`       | `setTrimStandardDeviation()`      | Auto standard deviation, 0 to 255                                                          | `.setTrimStandardDeviation(8)`           |
| `q`             | `setQuality()`                    | Integer quality                                                                            | `.setQuality(80)`                        |
| `fm`            | `setFormat()`                     | See [Output Format](#output-format)                                                        | `.setFormat('avif')`                     |
| `interlace`     | `setInterlaced()`                 | Boolean                                                                                    | `.setInterlaced(true)`                   |
| `fp`            | `setFocalPoint()`                 | Pixels or relative x/y                                                                     | `.setFocalPoint('25w', '75h')`           |
| `zoom`          | `setZoom()`                       | Numeric, `face`, `facesarea`, optional numeric fallback                                    | `.setZoom('face', 2.5)`                  |
| `zoompad`       | `setZoomPadding()`                | Pixels or relative x/y                                                                     | `.setZoomPadding(10, 20)`                |
| `face`          | `setFace()`                       | One-based face index                                                                       | `.setFace(1)`                            |
| `debug`         | `setDebug()`                      | Boolean                                                                                    | `.setDebug(true)`                        |
| `passthrough`   | `setPassthrough()`                | Boolean; false removes the flag                                                            | `.setPassthrough(true)`                  |

Dimensions accept decimal pixels and `p`, `w`, or `h` percentage units. For example, `5w` means 5% of the base image's width, and `35h` means 35% of its height. Paired values accept serialized `x:y` strings.

### Fit and Crop Position

`setFit()` and `setWatermarkFit()` accept `contain`, `max`, `fill`, `fill-max`, `stretch`, and `crop`.

Use `setCropPosition('top')` or constructor `{ crop: 'top' }` for a named crop. Anchors are `top-left`, `top`, `top-right`, `left`, `center`, `right`, `bottom-left`, `bottom`, and `bottom-right`.

```js
options.setFit('crop').setCropPosition('top');
// fit=crop and crop=top

options.setFocalPoint('25w', '75h').setZoom(2.5);
// Adds fp=25w:75h and zoom=2.5
```

An 80×80 watermark, zoomed 2× around `20p:20p` and centered:

```js
const options = new Options()
	.setWatermarkPath('bird.jpg')
	.setWatermarkWidth(80)
	.setWatermarkHeight(80)
	.setWatermarkFit('crop')
	.setWatermarkFocalPoint('20p', '20p')
	.setWatermarkZoom(2)
	.setWatermarkPosition('center');
```

### Faces and Zoom

```js
const options = new Options()
	.setFit('crop')
	.setCropPosition('face,top')
	.setFace(1)
	.setZoom('face', 2.5)
	.setZoomPadding('5p', '10p')
	.setDebug(true);
// fit=crop, crop=face,top, face=1, zoom=face,2.5, zoompad=5p:10p, debug=1
```

### Relative Values

Image dimensions, focal points, watermark dimensions, positioning, padding, and border width accept relative values. `p` uses the relevant axis, so `25p` means 25% of width for x and 25% of height for y. Append `w` or `h` to a percentage between 0 and 100: `5w` is 5% of the source width and `35h` is 35% of the source height.

```js
options
	.setWatermarkWidth('20w')
	.setWatermarkPadding('5w')
	.setBorder('2w', 'ffffff', 'overlay');
```

Options accept relative values and numeric values:

```js
const options = new Options()
	.setWidth('65p')
	.setHeight('50w')
	.setDevicePixelRatio(1.5)
	.setAspectRatio('16:9');

const width = options.get('width'); // '65p'
```

`get()` returns the serialized value. Numeric values become strings, and paired values retain their separators.

### Output Format

`setFormat()` accepts `strict`, `auto`, `jpg`, `jpeg`, `pjpg`, `png`, `gif`, `webp`, `avif`, `jxl`. The alias `jpeg` normalizes to `jpg`.

Omitting `fm` uses `strict`. With `fm=strict`, a missing or catch-all `Accept` header (`*/*` or `image/*`) preserves the source format. A specific `Accept` header selects the output format.

`fm=auto` always selects a format from `Accept`, falling back to AVIF. GIF inputs use WebP in auto mode, which supports animation.

```js
options.setFormat('jpeg');
console.log(options.get('format')); // 'jpg'
```

## SVG passthrough

Set `passthrough: true` in transform parameters to serve the original SVG through Small Pics, ignoring transforms. Other image formats still transform normally. Set it to `false` to omit the flag.

Use `setPassthrough(true)` to enable it and `setPassthrough(false)` to remove it.

```js
const options = new Options({ passthrough: true });
const builder = new UrlBuilder('https://images.example.com');
const url = builder.buildUrl('logo.svg', options);
// https://images.example.com/logo.svg?passthrough=1

options.setPassthrough(false); // Removes passthrough from the URL.
```

## Development

Install development dependencies:

```sh
npm ci
```

Run the test suite:

```sh
npm test
```

Run static analysis and style checks:

```sh
npm run check
npm run format:check
```

Apply style fixes:

```sh
npm run format
```
