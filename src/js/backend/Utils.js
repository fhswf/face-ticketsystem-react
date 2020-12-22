export function dataUriToBlob(dataUri) {
    // Check params
    if (!dataUri)
        return dataUri;
    let dataArr = dataUri.split(',');
    if (dataArr.length < 1)
        return dataUri;

    // Separate mimetype and bytes
    // Format: data:<mimetype>;base64,<bytes>
    let mimeType = dataArr[0].split(':')[1].split(';')[0];
    let bytesOfDataUri = atob(dataArr[1]);

    // Transform into ArrayBuffer and Uint8Array to create a Blob
    let arrayBuffer = new ArrayBuffer(bytesOfDataUri.length);
    let uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < bytesOfDataUri.length; i++)
        uint8Array[i] = bytesOfDataUri.charCodeAt(i);

    return new Blob([uint8Array], {type: mimeType});
}

/**
 * Converts a ImageBitmap object to a Blob.
 * @param imageBitmap The ImageBitmap object to be converted.
 * @returns {Promise<unknown>} The Promise containing the File when resolved.
 */
export function imageBitmapToFile(imageBitmap) {
    return new Promise((resolve, reject) => {
        // Create <canvas> to render bitmap
        const canvas = document.createElement('canvas');
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        let ctx = canvas.getContext('bitmaprenderer');

        if (ctx)
            ctx.transferFromImageBitmap(imageBitmap);
        else
            canvas.getContext('2d').drawImage(imageBitmap, 0, 0);

        // Resolve blob
        canvas.toBlob(resolve);
    }).then(blob => {
        return new File([blob], 'photo.png', {type: blob.type});
    })
}

/**
 * Transforms a blob into a Data URL.
 * @param blob The Blob to be transformed.
 * @returns {Promise<unknown>} A Promise which resolved the data URL.
 */
export function blobToURI(blob) {
    let fileReader = new FileReader();
    return new Promise(resolve => {
        fileReader.onloadend = () => {
            resolve(fileReader.result);
        };
        fileReader.readAsDataURL(blob);
    });
}

export function isImageCaptureSupported() {
    return typeof ImageCapture === 'function'
}