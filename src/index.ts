import { getTimes } from 'suncalc';

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

            let afterDawn = currentHour > afterHour;
            
            if (currentHour === afterHour) {
                afterDawn = time.getMinutes() >= after.getMinutes();
            }

            resolve(afterDawn);
        }

        if (useGeolocation && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const userLat = lat !== null ? lat : position.coords.latitude;
                    const userLon = lon !== null ? lon : position.coords.longitude;
                    checkWithCoordinates(userLat, userLon);
                },
                err => {
                    console.warn('Geolocation not allowed or failed, using default or provided coords.');
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

const SUNRISE = "sunrise";

/**
 * Returns a Promise that resolves to `true` if it is currently after dawn at the given location.
*/
export function isAfterDawn(afterOptions: AfterOptions = {}): Promise<boolean> {
    return isAfter(SUNRISE, afterOptions);
}

const SUNSET = "sunset";

/**
 * Returns a Promise that resolves to `true` if it is currently after sunset at the given location.
 */
export function isAfterSunset(afterOptions: AfterOptions = {}): Promise<boolean> {
    return isAfter(SUNSET, afterOptions);
}