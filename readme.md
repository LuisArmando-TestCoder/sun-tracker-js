# Sun Tracker JS

A TypeScript/JavaScript utility that determines whether it's currently after sunrise, after sunset, daylight, or nighttime at a given location. It also provides a chainable interface to react to changes in sunlight conditions over time.

This library leverages [SunCalc](https://github.com/mourner/suncalc) to accurately compute sunrise and sunset times, inherently accounting for Earth’s tilt, seasons, and your chosen coordinates.

## Features

- **Check Sun Status:**  
  - `isAfterSunrise(...)`: Returns `true` if current time is after sunrise.
  - `isAfterSunset(...)`: Returns `true` if current time is after sunset.
  - `isDaylight(...)`: Returns `true` if it's currently daylight (after sunrise but before sunset).
  - `isNightTime(...)`: Returns `true` if it's currently nighttime (after sunset).

- **Location Options:**  
  - Provide `lat` and `lon` directly for any location.
  - Use the browser’s geolocation by setting `useGeolocation: true` (requires HTTPS and user permission).
  - Defaults to the Equator (0,0) if no coordinates are provided and geolocation is not used.

- **Automated Sunlight Change Notifications:**  
  `onSunlightChange(...)` returns a chainable object that can periodically check the status and run callbacks on transitions:
  - `atNight(callback)`: Fires `callback` once when transitioning from daylight to nighttime.
  - `atDaylight(callback)`: Fires `callback` once when transitioning from night to daylight.
  - `atSunlightToggle(callback)`: Fires `callback` whenever daylight status toggles (either day→night or night→day).

## Installation

```bash
npm install sun-tracker-js
```

## Usage Examples

### Basic Status Checks

```typescript
import { isAfterSunrise, isAfterSunset, isDaylight, isNightTime } from 'sun-tracker-js';

// Check if after sunrise at a specific location (Madrid, Spain)
isAfterSunrise({ lat: 40.4168, lon: -3.7038 }).then(result => {
  console.log(`Is it after sunrise in Madrid? ${result}`);
});

// Check if after sunset using browser geolocation
isAfterSunset({ useGeolocation: true }).then(result => {
  console.log(`Is it after sunset at your location? ${result}`);
});

// Check if currently daylight at the Equator (default location)
isDaylight().then(result => {
  console.log(`Is it daylight at the Equator? ${result}`);
});

// Check if currently nighttime at a given time
const customTime = new Date('2024-12-24T23:00:00');
isNightTime({ lat: 34.0522, lon: -118.2437, time: customTime }).then(result => {
  console.log(`Is it night in Los Angeles at 11PM on Dec 24, 2024? ${result}`);
});
```

### Reacting to Sunlight Changes Over Time

Use `onSunlightChange()` to periodically check conditions (every `seconds` seconds) and run callbacks only when a transition occurs.

```typescript
import { onSunlightChange } from 'sun-tracker-js';

// Check every 60 seconds at your current location
onSunlightChange(60, { useGeolocation: true })
  .atNight(() => {
    console.log("It just turned to night!");
  })
  .atDaylight(() => {
    console.log("It's now daylight!");
  })
  .atSunlightToggle(hasSunlight => {
    console.log(`Sunlight status changed. Now: ${hasSunlight ? 'Day' : 'Night'}.`);
  });
```

**Note:**  
- `onSunlightChange()` sets up intervals for each chained condition you add.
- Each callback will fire when a state transition is detected (e.g., from daylight to night or vice versa).

## API

### `isAfterSunrise(options?: AfterOptions)`
- Checks if the current (or specified) time is after the sunrise at the given location.
- **Returns:** `Promise<boolean>`

### `isAfterSunset(options?: AfterOptions)`
- Checks if the current (or specified) time is after the sunset at the given location.
- **Returns:** `Promise<boolean>`

### `isDaylight(options?: AfterOptions)`
- Checks if it's currently daylight (after sunrise but before sunset).
- **Returns:** `Promise<boolean>`

### `isNightTime(options?: AfterOptions)`
- Checks if it's currently nighttime (after sunset).
- **Returns:** `Promise<boolean>`

### `onSunlightChange(seconds: number, options?: AfterOptions)`
- Sets an interval (every `seconds` seconds) and returns an object with chainable methods:
  - `atNight(callback: Function)`: Runs `callback` upon transitioning from daylight to night.
  - `atDaylight(callback: Function)`: Runs `callback` upon transitioning from night to daylight.
  - `atSunlightToggle(callback: (hasSunlight: boolean) => void)`: Runs `callback` whenever daylight status toggles.
- **Returns:** An object allowing chained calls to `atNight`, `atDaylight`, and `atSunlightToggle`.

**Priority of Location:**
1. `lat` & `lon` if provided.
2. If `useGeolocation: true`, tries browser geolocation.
3. Defaults to the Equator (0,0).

**Earth Tilt Consideration:**
`getTimes()` from SunCalc inherently takes Earth’s tilt into account when computing sunrise/sunset times.

## Requirements

- Browser environment with optional geolocation.
- Running under HTTPS if geolocation is used.

## License

[MIT](./LICENSE)