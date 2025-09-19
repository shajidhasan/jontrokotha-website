// image.worker.ts

/**
 * A helper function to check if a color is similar to pure white within a given tolerance.
 */
function isColorWhiteish(r: number, g: number, b: number, tolerance: number): boolean {
    const PURE_WHITE_R = 255;
    const PURE_WHITE_G = 255;
    const PURE_WHITE_B = 255;

    return (
        Math.abs(r - PURE_WHITE_R) <= tolerance &&
        Math.abs(g - PURE_WHITE_G) <= tolerance &&
        Math.abs(b - PURE_WHITE_B) <= tolerance
    );
}

// Listen for messages from the main thread
self.onmessage = (event: MessageEvent<{ imageData: ImageData, tolerance: number }>) => {
    const { imageData, tolerance } = event.data;
    const { width, height, data } = imageData;

    // --- HEAVY COMPUTATION STARTS HERE ---

    // 1. Flood fill from all edges to remove the background.
    const queue: [number, number][] = [];
    // Use a boolean array for performance, it's faster than a Set for this use case.
    const visited = new Uint8Array(width * height);

    // Helper to get pixel index from coordinates
    const getPixelIndex = (x: number, y: number) => (y * width + x);

    // Seed the queue with all white-ish pixels from the image border
    // Top and Bottom edges
    for (let x = 0; x < width; x++) {
        // Top edge
        let pos = getPixelIndex(x, 0) * 4;
        if (isColorWhiteish(data[pos], data[pos + 1], data[pos + 2], tolerance)) {
            queue.push([x, 0]);
            visited[getPixelIndex(x, 0)] = 1;
        }
        // Bottom edge
        pos = getPixelIndex(x, height - 1) * 4;
        if (isColorWhiteish(data[pos], data[pos + 1], data[pos + 2], tolerance)) {
            queue.push([x, height - 1]);
            visited[getPixelIndex(x, height - 1)] = 1;
        }
    }

    // Left and Right edges
    for (let y = 1; y < height - 1; y++) { // Avoid re-checking corners
        // Left edge
        let pos = getPixelIndex(0, y) * 4;
        if (isColorWhiteish(data[pos], data[pos + 1], data[pos + 2], tolerance)) {
            queue.push([0, y]);
            visited[getPixelIndex(0, y)] = 1;
        }
        // Right edge
        pos = getPixelIndex(width - 1, y) * 4;
        if (isColorWhiteish(data[pos], data[pos + 1], data[pos + 2], tolerance)) {
            queue.push([width - 1, y]);
            visited[getPixelIndex(width - 1, y)] = 1;
        }
    }

    // Now, run the flood fill
    while (queue.length > 0) {
        const [x, y] = queue.shift()!;
        const pos = getPixelIndex(x, y) * 4;

        // Make the current pixel transparent
        data[pos + 3] = 0;

        // Check neighbors
        const neighbors: [number, number][] = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
        for (const [nx, ny] of neighbors) {
            // Check if neighbor is within bounds
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const neighborIndex = getPixelIndex(nx, ny);
                // If not visited yet
                if (visited[neighborIndex] === 0) {
                    const neighborPos = neighborIndex * 4;
                    // And its color is also white-ish
                    if (isColorWhiteish(data[neighborPos], data[neighborPos + 1], data[neighborPos + 2], tolerance)) {
                        visited[neighborIndex] = 1;
                        queue.push([nx, ny]);
                    }
                }
            }
        }
    }


    // 2. Find the bounding box of the non-transparent content (this logic remains the same)
    let minX = width, minY = height, maxX = -1, maxY = -1;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const alpha = data[(y * width + x) * 4 + 3];
            if (alpha > 0) {
                minX = Math.min(x, minX);
                minY = Math.min(y, minY);
                maxX = Math.max(x, maxX);
                maxY = Math.max(y, maxY);
            }
        }
    }

    const boundingBox = { minX, minY, maxX, maxY };

    // --- HEAVY COMPUTATION ENDS ---

    // Send the processed data back to the main thread.
    self.postMessage({ processedImageData: imageData, boundingBox });
};

// This export is needed to satisfy TypeScript's module system, even in a worker.
export { };