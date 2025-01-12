import { useRef, useState, useEffect } from "react";

export function useContainerDimensions() {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ x: 0, y: 0, width: 0, height: 0 });

    useEffect(() => {
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

        updateDimensions();

        const resizeObserver = new ResizeObserver(updateDimensions);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    return [containerRef, dimensions];
}
