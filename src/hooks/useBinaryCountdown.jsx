"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBinaryCountdown = exports.formatTime = void 0;
const react_1 = require("react");
const MIN_TIME_LEFT = 50; // Minimum threshold (in seconds) before selecting the next expiration
/**
 * Formats a given time (in seconds) into HH:MM:SS format.
 */
const formatTime = (timeInSeconds) => {
    const roundedTime = Math.floor(timeInSeconds);
    const hours = String(Math.floor(roundedTime / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((roundedTime % 3600) / 60)).padStart(2, "0");
    const seconds = String(roundedTime % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
};
exports.formatTime = formatTime;
/**
 * Generates a list of expiration times based on predefined minute intervals.
 * Starts counting from the next full minute.
 */
const generateExpirations = () => {
    const expirations = [1, 2, 3, 5, 10, 15, 20, 30, 60, 120, 240, 360];
    const now = new Date();
    // Move to the very next full minute to ensure expirations start at a clean minute mark.
    now.setSeconds(0, 0);
    if (now.getTime() <= Date.now()) {
        now.setMinutes(now.getMinutes() + 1);
    }
    return expirations.map((minutes) => {
        const expirationTime = new Date(now.getTime() + minutes * 60000);
        return { minutes, expirationTime };
    });
};
/**
 * Hook that provides a countdown mechanism for binary expirations.
 * It updates every second, shifting to a future expiration when the current one
 * is within a certain threshold of expiring.
 */
const useBinaryCountdown = () => {
    const [expirations, setExpirations] = (0, react_1.useState)(generateExpirations);
    // Find an initial expiration that is more than MIN_TIME_LEFT seconds away, or fallback to the first one.
    const initialExpiry = expirations.find((exp) => (exp.expirationTime.getTime() - Date.now()) / 1000 > MIN_TIME_LEFT) || expirations[0];
    const [expiry, setExpiry] = (0, react_1.useState)(initialExpiry);
    /**
     * Recalculate expirations and possibly update the current expiry if we're running out of time.
     */
    const updateExpirations = (0, react_1.useCallback)(() => {
        const newExpirations = generateExpirations();
        setExpirations(newExpirations);
        const timeLeft = Math.round((expiry.expirationTime.getTime() - Date.now()) / 1000);
        // If the current expiry is too close, select the next suitable one
        if (timeLeft <= MIN_TIME_LEFT) {
            const nextExpiration = newExpirations.find((exp) => (exp.expirationTime.getTime() - Date.now()) / 1000 > MIN_TIME_LEFT);
            if (nextExpiration) {
                setExpiry(nextExpiration);
            }
        }
    }, [expiry]);
    (0, react_1.useEffect)(() => {
        const interval = setInterval(updateExpirations, 1000);
        return () => clearInterval(interval);
    }, [updateExpirations]);
    return { expirations, expiry, setExpiry };
};
exports.useBinaryCountdown = useBinaryCountdown;
