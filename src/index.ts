import { getTimes } from 'suncalc';

const SUNRISE = "sunrise";
const SUNSET = "sunset";

export interface AfterOptions {
    lat?: number;
    lon?: number;
    useGeolocation?: boolean;
    time?: Date;
}

/**
 * - If `useGeolocation` is true, tries to get the user’s location from the browser.
 * - If lat/lon are provided, uses those coordinates.
 * - Defaults to the Equator if none is provided.
 * - Earth's tilt is inherently accounted for via suncalc's calculations based on date and coordinates.
 */
function isAfter(afterOption: "sunrise" | "sunset", {
    lat,
    lon,
    useGeolocation = false,
    time = new Date()
}: AfterOptions = {}): Promise<boolean> {
    return new Promise(resolve => {
        const defaultLat = 0;
        const defaultLon = 0;

        function checkWithCoordinates(latitude: number = defaultLat, longitude: number = defaultLon) {
            const times = getTimes(time, latitude, longitude);
            const after = times[afterOption];
            const currentHour = time.getHours();
            const afterHour = after.getHours();

            let isAfterTime = currentHour > afterHour;

            if (currentHour === afterHour) {
                isAfterTime = time.getMinutes() >= after.getMinutes();
            }

            resolve(isAfterTime);
        }

        if (useGeolocation && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const userLat = lat !== null ? lat : position.coords.latitude;
                    const userLon = lon !== null ? lon : position.coords.longitude;
                    checkWithCoordinates(userLat, userLon);
                },
                err => {
                    console.warn('Geolocation not allowed or failed, using default or provided coords.', err);
                    const finalLat = lat !== null ? lat : defaultLat;
                    const finalLon = lon !== null ? lon : defaultLon;
                    checkWithCoordinates(finalLat, finalLon);
                }
            );
        } else {
            const finalLat = lat !== null ? lat : defaultLat;
            const finalLon = lon !== null ? lon : defaultLon;
            checkWithCoordinates(finalLat, finalLon);
        }
    });
}

/**
 * Returns a Promise that resolves to `true` if it is currently after dawn at the given location.
*/
export async function isAfterSunrise(afterOptions: AfterOptions) {
    return await isAfter(SUNRISE, afterOptions);
}

/**
 * Returns a Promise that resolves to `true` if it is currently after sunset at the given location.
 */
export async function isAfterSunset(afterOptions: AfterOptions) {
    return await isAfter(SUNSET, afterOptions);
}

/**
 * Returns a Promise that resolves to `true` if it is currently daylight.
 */
export async function isDaylight(afterOptions: AfterOptions) {
    const [
        isItAfterSunrise,
        isItAfterSunset
    ] = await Promise.all([isAfterSunrise(afterOptions), isAfterSunset(afterOptions)]);

    return isItAfterSunrise && !isItAfterSunset;
}

/**
 * Returns a Promise that resolves to `true` if it is currently nightime.
 */
export async function isNightTime(afterOptions: AfterOptions) {
    const isItAfterSunset = await isAfterSunset(afterOptions);

    return isItAfterSunset;
}