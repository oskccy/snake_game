import { useEffect, useRef } from "react";

/**
 * useInterval is a custom React hook that allows for the creation of an interval
 * that adheres to React's lifecycle (i.e., it gets cleared on unmount).
 *
 * @param callback - The function to be executed at each interval.
 * @param delay - The delay in milliseconds for the interval. If `null`, the interval is paused.
 */
const useInterval = (callback: () => void, delay: number | null) => {
    // useRef hook to store the callback, allowing us to keep track of the latest callback 
    // without causing the interval to re-run every time the callback might change.
	const savedCallback = useRef(callback);

	// Remember the latest callback.
	// This ensures that if the callback function changes (because it's redefined or has changed dependencies),
	// we're always using the most up-to-date version of the callback within our interval.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// Set up the interval and clear it on unmount or if the delay changes.
	useEffect(() => {
		// Don't schedule if no delay is specified (effectively pausing the interval).
		if (delay === null) {
			return;
		}

        // Initialize the interval, and execute the saved callback on each tick.
		const id = setInterval(() => savedCallback.current(), delay);

        // Cleanup function: clears the interval when the component using the hook unmounts, 
        // or if the delay changes. This prevents potential memory leaks and ensures the timer is managed correctly.
		return () => clearInterval(id);
	}, [delay]);
}

export default useInterval;
