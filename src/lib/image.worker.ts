const isColorWhiteish = (r: number, g: number, b: number, tolerance: number): boolean => {
    const PURE_WHITE = 255;
    return (
        Math.abs(r - PURE_WHITE) <= tolerance &&
        Math.abs(g - PURE_WHITE) <= tolerance &&
        Math.abs(b - PURE_WHITE) <= tolerance
    );
}

self.onmessage = (event: MessageEvent<{ imageData: ImageData, tolerance: number, minAreaPercentage: number }>) => {
    const { imageData, tolerance, minAreaPercentage } = event.data;
    const { width, height, data } = imageData;

    // Fix: Calculate minimum area based on total image area, not just width
    const totalArea = width * height;
    const minAreaToRemove = (totalArea * minAreaPercentage) / 100;

    const visited = new Uint8Array(width * height);
    const getPixelIndex = (x: number, y: number) => (y * width + x);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const pixelIndex = getPixelIndex(x, y);

            if (visited[pixelIndex] === 1) {
                continue;
            }

            const pos = pixelIndex * 4;
            if (!isColorWhiteish(data[pos], data[pos + 1], data[pos + 2], tolerance)) {
                continue;
            }

            // Use a more efficient queue implementation
            const queue: [number, number][] = [[x, y]];
            const currentBlobPixels: [number, number][] = [];
            visited[pixelIndex] = 1;

            let queueStart = 0;
            while (queueStart < queue.length) {
                const [cx, cy] = queue[queueStart++];
                currentBlobPixels.push([cx, cy]);

                const neighbors: [number, number][] = [
                    [cx + 1, cy],
                    [cx - 1, cy],
                    [cx, cy + 1],
                    [cx, cy - 1]
                ];

                for (const [nx, ny] of neighbors) {
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const neighborIndex = getPixelIndex(nx, ny);
                        if (visited[neighborIndex] === 0) {
                            const neighborPos = neighborIndex * 4;
                            if (isColorWhiteish(data[neighborPos], data[neighborPos + 1], data[neighborPos + 2], tolerance)) {
                                visited[neighborIndex] = 1;
                                queue.push([nx, ny]);
                            }
                        }
                    }
                }
            }

            // Remove white blobs that are larger than the minimum area
            if (currentBlobPixels.length > minAreaToRemove) {
                for (const [px, py] of currentBlobPixels) {
                    const alphaIndex = getPixelIndex(px, py) * 4 + 3;
                    data[alphaIndex] = 0;
                }
            }
        }
    }

    // Calculate bounding box of remaining visible pixels
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

    // Return null for empty images or valid bounding box
    const boundingBox = (maxX === -1)
        ? null
        : { minX, minY, maxX, maxY };

    self.postMessage({ processedImageData: imageData, boundingBox });
};

export { };