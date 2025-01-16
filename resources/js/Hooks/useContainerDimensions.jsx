import { useRef, useState, useEffect } from "react";

export function useContainerDimensions(limitFps = 60) {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const delay = 1000 / limitFps;

    useEffect(() => {
        let timeoutId;

        const updateDimensions = () => {
            if (containerRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const parentRect = containerRef.current.parentElement.getBoundingClientRect();

                const x = containerRect.x - parentRect.x;
                const y = containerRect.y - parentRect.y;
                const { width, height } = containerRect;

                setDimensions({ x, y, width, height });
            }
        };

        const throttledUpdate = () => {
            if (!timeoutId) {
                timeoutId = setTimeout(() => {
                    updateDimensions();
                    timeoutId = null;
                }, delay);
            }
        };

        updateDimensions();

        const resizeObserver = new ResizeObserver(throttledUpdate);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            clearTimeout(timeoutId);
            resizeObserver.disconnect();
        };
    }, [delay]);

    return [containerRef, dimensions];
}
