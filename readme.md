# sun-tracker-js

A TypeScript library that helps determine whether it is after sunrise, after sunset, currently daylight, or nighttime at a given location, using [SunCalc](https://github.com/mourner/suncalc).

**Key Features:**
- Functions: `isAfterSunrise`, `isAfterSunset`, `isDaylight`, `isNightTime`.
- Each returns a Promise with a boolean result.
- Defaults to the Equator if no location is provided.
- Optionally uses browser’s geolocation if requested.
- Automatically accounts for Earth's tilt and seasonal changes, as `suncalc` calculations depend on date and coordinates.
- Written in TypeScript with type definitions included.

## Installation

```bash
npm install sun-tracker-js
```

## Usage Examples (Async/Await)

### Checking After Sunrise

```typescript
import { isAfterSunrise } from 'sun-tracker-js';

(async () => {
  const isDaylightNow = await isAfterSunrise();
  console.log(`Equator: Is it after sunrise? ${isDaylightNow}`);
})();
```

### Checking After Sunset

```typescript
import { isAfterSunset } from 'sun-tracker-js';

(async () => {
  const isNightNow = await isAfterSunset();
  console.log(`Equator: Is it after sunset? ${isNightNow}`);
})();
```

### Checking If It's Daylight

```typescript
import { isDaylight } from 'sun-tracker-js';

(async () => {
  const daylight = await isDaylight({ lat: 40.4168, lon: -3.7038 });
  console.log(`Madrid: Is it daylight now? ${daylight}`);
})();
```

### Checking If It's Nighttime

```typescript
import { isNightTime } from 'sun-tracker-js';

(async () => {
  const night = await isNightTime({ useGeolocation: true });
  console.log(`Your location: Is it nighttime now? ${night}`);
})();
```

### Using Geolocation (Browser Only)

```typescript
import { isAfterSunrise, isAfterSunset } from 'sun-tracker-js';

(async () => {
  const afterSunrise = await isAfterSunrise({ useGeolocation: true });
  console.log(`Your location: Is it after sunrise? ${afterSunrise}`);

  const afterSunset = await isAfterSunset({ useGeolocation: true });
  console.log(`Your location: Is it after sunset? ${afterSunset}`);
})();
```

**Note:** Geolocation requires a secure context (HTTPS) and the user's permission.

## API

### `isAfterSunrise(options?: AfterOptions)`
Checks if the current time is after sunrise.

**Parameters:**
- `lat?: number`
- `lon?: number`
- `useGeolocation?: boolean`
- `time?: Date` (defaults to now)

**Returns:**  
`Promise<boolean>`

### `isAfterSunset(options?: AfterOptions)`
Checks if the current time is after sunset.

**Parameters:**
- `lat?: number`
- `lon?: number`
- `useGeolocation?: boolean`
- `time?: Date` (defaults to now)

**Returns:**  
`Promise<boolean>`

### `isDaylight(options?: AfterOptions)`
Checks if it's currently daylight.  
This returns `true` if it's after sunrise and not yet after sunset.

**Parameters:**
- `lat?: number`
- `lon?: number`
- `useGeolocation?: boolean`
- `time?: Date` (defaults to now)

**Returns:**  
`Promise<boolean>`

### `isNightTime(options?: AfterOptions)`
Checks if it's currently nighttime.  
This returns `true` if it's after sunset.

**Parameters:**
- `lat?: number`
- `lon?: number`
- `useGeolocation?: boolean`
- `time?: Date` (defaults to now)

**Returns:**  
`Promise<boolean>`

**Priority of Location for All Functions:**
1. If `lat` and `lon` are provided, those are used.
2. Else if `useGeolocation` is `true`, it attempts to find the user's location.
3. Otherwise, defaults to Equator (0,0).

**Earth Tilt Consideration:**
All functions rely on `suncalc`, which uses latitude, longitude, and date to inherently account for Earth's tilt and seasonal variations.

## Example in Browser

If you're using this in a browser environment with bundling:

```typescript
import { isDaylight, isNightTime } from 'sun-tracker-js';

document.getElementById('checkDaylightBtn')?.addEventListener('click', async () => {
  const daylight = await isDaylight({ useGeolocation: true });
  alert(`Is it daylight at your location? ${daylight}`);
});

document.getElementById('checkNightBtn')?.addEventListener('click', async () => {
  const night = await isNightTime({ useGeolocation: true });
  alert(`Is it nighttime at your location? ${night}`);
});
```

## Building & Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sun-tracker-js.git
   cd sun-tracker-js
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build:
   ```bash
   npm run build
   ```
   Compiled files will be output to `dist/`.

4. Link it locally to test in another project:
   ```bash
   npm link
   ```

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a PR or issue on the GitHub repository.

## License

[MIT](./LICENSE)