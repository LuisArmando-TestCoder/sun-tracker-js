# sun-tracker-js

A simple TypeScript library to determine if it is currently after dawn or after sunset at a given location using [SunCalc](https://github.com/mourner/suncalc).

**Key Features:**
- Two functions: `isAfterDawn` and `isAfterSunset`.
- Each returns a Promise that resolves to `true` if the current time is after dawn/sunset, `false` otherwise.
- Defaults to the Equator if no location is provided.
- Optionally uses the browser’s geolocation if requested.
- Automatically accounts for Earth’s tilt and seasonal changes, as `suncalc` calculations depend on date and coordinates.
- Written in TypeScript with type definitions included.

## Installation

```bash
npm install sun-tracker-js
```

## Usage Examples

### Checking After Dawn

```typescript
import { isAfterDawn } from 'sun-tracker-js';

isAfterDawn().then(isDaylight => {
  console.log(`Equator: Is it after dawn? ${isDaylight}`);
});
```

### Checking After Sunset

```typescript
import { isAfterSunset } from 'sun-tracker-js';

isAfterSunset().then(isNight => {
  console.log(`Equator: Is it after sunset? ${isNight}`);
});
```

### Using Coordinates

```typescript
// Check dawn status in Madrid
isAfterDawn({ lat: 40.4168, lon: -3.7038 }).then(isDaylight => {
  console.log(`Madrid: Is it after dawn? ${isDaylight}`);
});

// Check sunset status in Madrid
isAfterSunset({ lat: 40.4168, lon: -3.7038 }).then(isNight => {
  console.log(`Madrid: Is it after sunset? ${isNight}`);
});
```

### Using Geolocation (Browser Only)

```typescript
isAfterDawn({ useGeolocation: true }).then(isDaylight => {
  console.log(`Your location: Is it after dawn? ${isDaylight}`);
});

isAfterSunset({ useGeolocation: true }).then(isNight => {
  console.log(`Your location: Is it after sunset? ${isNight}`);
});
```

**Note:** Geolocation requires a secure context (HTTPS) and the user's permission.

## API

### `isAfterDawn(options?: IsAfterDawnOptions)`

**Parameters:**

- `lat?: number` — The latitude of the location.
- `lon?: number` — The longitude of the location.
- `useGeolocation?: boolean` — If `true`, tries the browser's geolocation.
- `time?: Date` — The date and time to check (defaults to now).

**Returns:**  
- `Promise<boolean>` — Resolves to `true` if after dawn, `false` otherwise.

### `isAfterSunset(options?: IsAfterSunsetOptions)`

**Parameters:**

- `lat?: number` — The latitude of the location.
- `lon?: number` — The longitude of the location.
- `useGeolocation?: boolean` — If `true`, tries the browser's geolocation.
- `time?: Date` — The date and time to check (defaults to now).

**Returns:**  
- `Promise<boolean>` — Resolves to `true` if after sunset, `false` otherwise.

**Priority of Location for Both:**
1. If `lat` and `lon` are provided, those are used.
2. Else if `useGeolocation` is `true`, it attempts to find the user's location.
3. Otherwise, defaults to the Equator (0,0).

**Earth Tilt Consideration:**
`sun-tracker-js` relies on `suncalc`, which computes times based on latitude, longitude, and date. This inherently accounts for Earth's tilt and seasonal changes.

## Example in Browser

If you're using this in a browser environment with bundling:

```typescript
import { isAfterDawn, isAfterSunset } from 'sun-tracker-js';

document.getElementById('checkDawnBtn')?.addEventListener('click', () => {
  isAfterDawn({ useGeolocation: true }).then(isDaylight => {
    alert(`Is it after dawn at your location? ${isDaylight}`);
  });
});

document.getElementById('checkSunsetBtn')?.addEventListener('click', () => {
  isAfterSunset({ useGeolocation: true }).then(isNight => {
    alert(`Is it after sunset at your location? ${isNight}`);
  });
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

4. You can link it locally to test in another project:
   ```bash
   npm link
   ```

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a PR or issue on the GitHub repository.

## License

[MIT](./LICENSE)