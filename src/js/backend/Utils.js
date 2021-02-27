import {PDFDocument} from "pdf-lib";
import * as faceapi from 'face-api.js';

/**
 * Creates a Blob object using a Data URL.
 * @param dataUri The Data URL to be transformed into a Blob.
 * @returns {Blob|*} The Blob representing the file.
 */
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

/**
 * Transforms a file into a ArrayBuffer.
 * @param file The File to be transformed.
 * @returns {Promise<unknown>} A Promise which resolved the array buffer.
 */
export function fileToArrayBuffer(file) {
    let fileReader = new FileReader();
    return new Promise((resolve, reject) => {
        fileReader.onerror = err => reject(err);
        fileReader.onloadend = () => resolve(fileReader.result);
        fileReader.readAsArrayBuffer(file);
    });
}

/**
 * Determine whether or not the Browser Support the ImageCapture API.
 * @returns {boolean} True, if the Browser support the ImageCapture API, otherwise false.
 */
export function isImageCaptureSupported() {
    return typeof ImageCapture === 'function'
}

/**
 * Create a new <image> object using a DataURL.
 * @param url The DataURL of the image to be created.
 * @returns {Promise<unknown>} On success, resolves the Image object, rejects the error otherwise.
 */
export function createImageFromDataURL(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', err => reject(err));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });
}

/**
 * Determines whether or not one face is within the given image file using face-api js.
 * @param file The image as a file.
 * @returns {Promise<boolean>} A Promise resolving true if there is only 1 face in the image.
 * Resolves false if there are 0 or more than 1 faces in the image. Otherwise rejects with errors.
 */
export function hasImageOnlyOneFace(file) {
    return new Promise((resolve, reject) => {
        faceapi.bufferToImage(file)
            .then(image => {
                faceapi.detectAllFaces(image)
                    .then(faces => {
                        resolve(faces.length === 1);
                    })
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}