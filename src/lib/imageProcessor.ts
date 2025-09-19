// imageProcessor.ts

/**
 * A helper function to load a base64 string into an HTMLImageElement asynchronously.
 */
function loadImageFromBase64(base64: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Failed to load image from base64 string.'));
        image.src = base64;
    });
}

/**
 * Processes a base64 encoded image in a non-blocking way using a Web Worker.
 * It makes the outer white-ish background transparent and trims surrounding transparent space.
 *
 * @param base64Image The input image as a base64 string (e.g., "data:image/png;base64,...").
 * @param tolerance The tolerance for what is considered "white". Defaults to 10.
 * @returns A promise that resolves to the processed image as a base64 PNG string.
 */
export async function processImage(base64Image: string, tolerance: number = 10): Promise<string> {
    try {
        // 1. Load the image and get its pixel data on the main thread
        const image = await loadImageFromBase64(base64Image);
        const { width, height } = image;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get canvas context.');
        }

        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, width, height);

        // 2. Offload the heavy processing to the Web Worker
        return new Promise((resolve, reject) => {
            // The `new URL(...)` syntax is the standard way to reference worker scripts
            // with modern bundlers like Vite or Webpack 5.
            const worker = new Worker(new URL('./image.worker.ts', import.meta.url), {
                type: 'module'
            });

            worker.onmessage = (event) => {
                const { processedImageData, boundingBox } = event.data;
                const { minX, minY, maxX, maxY } = boundingBox;

                // Handle case where image is completely transparent
                if (maxX === -1) {
                    console.warn("Image is completely transparent after processing. Returning an empty image.");
                    resolve(document.createElement('canvas').toDataURL()); // Return 1x1 transparent pixel
                    worker.terminate();
                    return;
                }

                // 3. Perform the final canvas operations on the main thread
                const newWidth = maxX - minX + 1;
                const newHeight = maxY - minY + 1;

                const trimCanvas = document.createElement('canvas');
                trimCanvas.width = newWidth;
                trimCanvas.height = newHeight;
                const trimCtx = trimCanvas.getContext('2d');
                if (!trimCtx) {
                    throw new Error('Could not get trimmed canvas context.');
                }

                // Put the processed data (with transparency) into a temporary canvas
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = width;
                tempCanvas.height = height;
                tempCanvas.getContext('2d')?.putImageData(processedImageData, 0, 0);

                // Draw the cropped section from the temp canvas to the final canvas
                trimCtx.drawImage(
                    tempCanvas,
                    minX, minY, newWidth, newHeight, // Source rectangle
                    0, 0, newWidth, newHeight       // Destination rectangle
                );

                // 4. Resolve the promise with the final base64 image
                resolve(trimCanvas.toDataURL('image/png'));

                // Clean up the worker
                worker.terminate();
            };

            worker.onerror = (error) => {
                console.error("Error in web worker:", error);
                reject(new Error("Failed to process image in worker."));
                worker.terminate();
            };

            // 5. Send the image data to the worker.
            // The second argument is a list of "transferable" objects.
            // This transfers ownership of the data buffer to the worker (zero-copy),
            // which is much more efficient than cloning it.
            worker.postMessage({ imageData, tolerance }, [imageData.data.buffer]);
        });

    } catch (error) {
        console.error("Error processing image:", error);
        throw new Error("Failed to process image.");
    }
}