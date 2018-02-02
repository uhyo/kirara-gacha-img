
import {
    IIcon,
} from './find-icons';

/**
 * Extract an icon from given context.
 */
export function extractIcon(
    image: /* CanvasImageSource */ HTMLCanvasElement | HTMLImageElement,
    box: IIcon,
): Promise<string> {
    const canvas = document.createElement('canvas');
    canvas.width = box.width;
    canvas.height = box.height;

    const ctx = canvas.getContext('2d');
    if (ctx == null) {
        throw new Error('Canvas Error');
    }

    ctx.drawImage(image, box.x, box.y, box.width, box.height, 0, 0, box.width, box.height);

    return new Promise((resolve)=>{
        const img = document.createElement('img');
        // get URL of this canvas.
        if (canvas.toBlob) {
            canvas.toBlob((blob)=>{
                const url = URL.createObjectURL(blob);
                resolve(url);
            }, 'image/png');
        } else {
            const url = canvas.toDataURL('image/png');
            resolve(url);
        }
    });
}
