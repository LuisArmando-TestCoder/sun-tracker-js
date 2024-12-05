import { getTimes } from 'suncalc';

const SUNRISE = "sunrise";
const SUNSET = "sunset";

export interface AfterOptions {
    lat?: number;
    lon?: number;
    useGeolocation?: boolean;  // If true, attempt browser geolocation
    time?: Date;               // Optional time to check, defaults to current time
}

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
            const afterTime = times[afterOption];
            const currentHour = time.getHours();
            const afterHour = afterTime.getHours();

            let isAfterTime = currentHour > afterHour;

            if (currentHour === afterHour) {
                isAfterTime = time.getMinutes() >= afterTime.getMinutes();
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
 * Checks if it's currently after sunrise at the given location.
 * Returns a Promise that resolves to `true` if after sunrise, `false` otherwise.
 */
async function isAfterSunrise(afterOptions?: AfterOptions) {
    return await isAfter(SUNRISE, afterOptions);
}

/**
 * Checks if it's currently after sunset at the given location.
 * Returns a Promise that resolves to `true` if after sunset, `false` otherwise.
 */
async function isAfterSunset(afterOptions?: AfterOptions) {
    return await isAfter(SUNSET, afterOptions);
}

/**
 * Checks if it's currently daylight.
 * Daylight means it's after sunrise but not yet after sunset.
 * Returns a Promise that resolves to `true` if currently daylight, `false` otherwise.
 */
async function isDaylight(afterOptions?: AfterOptions) {
    const [isItAfterSunrise, isItAfterSunset] = await Promise.all([
        isAfterSunrise(afterOptions),
        isAfterSunset(afterOptions)
    ]);

    return isItAfterSunrise && !isItAfterSunset;
}

/**
 * Checks if it's currently nighttime.
 * Nighttime means it is after sunset.
 * Returns a Promise that resolves to `true` if currently night, `false` otherwise.
 */
async function isNightTime(afterOptions?: AfterOptions) {
    const isItAfterSunset = await isAfterSunset(afterOptions);
    return isItAfterSunset;
}

/**
 * Returns a chainable object with three methods:
 * - atNight(callback): Executes the callback once when it transitions from daylight to night.
 * - atDaylight(callback): Executes the callback once when it transitions from night to daylight.
 * - atSunlightToggle(callback): Executes the callback whenever the state toggles between having daylight and not.
 */
async function onSunlightChange(seconds = 1, afterOptions?: AfterOptions) {
    let hadDaylight = await isDaylight(afterOptions);
    const secondsInterval = seconds * 1e3;

    function getSunChangeChain(callback: Function) {
        setInterval(() => {
            callback();
        }, secondsInterval);

        return chain;
    }

    const chain = {
        atNight(callback: Function) {
            return getSunChangeChain(async () => {
                const isItNightTime = await isNightTime(afterOptions);

                if (isItNightTime && hadDaylight) {
                    hadDaylight = false;
                    callback();
                }
            });
        },
        atDaylight(callback: Function) {
            return getSunChangeChain(async () => {
                const isItDaylight = await isDaylight(afterOptions);

                if (isItDaylight && !hadDaylight) {
                    hadDaylight = true;
                    callback();
                }
            });
        },
        atSunlightToggle(callback: (havingSunlight: boolean) => void) {
            return getSunChangeChain(async () => {
                const isItDaylight = await isDaylight(afterOptions);

                if (isItDaylight !== hadDaylight) {
                    hadDaylight = isItDaylight;
                    callback(hadDaylight);
                }
            });
        }
    }

    return chain;
}

export { isAfterSunrise, isAfterSunset, isDaylight, isNightTime, onSunlightChange };