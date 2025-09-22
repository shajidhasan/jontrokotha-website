const loadImageFromBase64 = (base64: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Failed to load image from base64 string.'));
        image.src = base64;
    });
}

export const processImage = async (base64Image: string, tolerance: number = 10, minAreaPercentage: number = 10): Promise<string> => {
    try {

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


        return new Promise((resolve, reject) => {


            const worker = new Worker(new URL('./image.worker.ts', import.meta.url), {
                type: 'module'
            });

            worker.onmessage = (event) => {
                const { processedImageData, boundingBox } = event.data;
                const { minX, minY, maxX, maxY } = boundingBox;


                if (maxX === -1) {
                    console.warn("Image is completely transparent after processing. Returning an empty image.");
                    resolve(document.createElement('canvas').toDataURL());
                    worker.terminate();
                    return;
                }


                const newWidth = maxX - minX + 1;
                const newHeight = maxY - minY + 1;

                const trimCanvas = document.createElement('canvas');
                trimCanvas.width = newWidth;
                trimCanvas.height = newHeight;
                const trimCtx = trimCanvas.getContext('2d');
                if (!trimCtx) {
                    throw new Error('Could not get trimmed canvas context.');
                }


                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = width;
                tempCanvas.height = height;
                tempCanvas.getContext('2d')?.putImageData(processedImageData, 0, 0);


                trimCtx.drawImage(
                    tempCanvas,
                    minX, minY, newWidth, newHeight,
                    0, 0, newWidth, newHeight
                );


                resolve(trimCanvas.toDataURL('image/png'));


                worker.terminate();
            };

            worker.onerror = (error) => {
                console.error("Error in web worker:", error);
                reject(new Error("Failed to process image in worker."));
                worker.terminate();
            };





            worker.postMessage({ imageData, tolerance, minAreaPercentage }, [imageData.data.buffer]);
        });

    } catch (error) {
        console.error("Error processing image:", error);
        throw new Error("Failed to process image.");
    }
}