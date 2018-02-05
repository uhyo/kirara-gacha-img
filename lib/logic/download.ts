/**
 * Download the image.
 */
export async function download(canvas: HTMLCanvasElement): Promise<string | null> {

    const a = document.createElement('a');
    if (a.download === undefined) {
        // cannot use download!
        return canvas.toDataURL('image/png');
    }

    const url = await canvasToURL(canvas);
    a.download = 'gacha.png';
    a.target = '_blank';
    a.href = url;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    return null;
}

function canvasToURL(canvas: HTMLCanvasElement): Promise<string> {
    if (canvas.toBlob != null) {
        return new Promise((resolve, reject)=> {
            canvas.toBlob((blob)=> {
                if (blob == null) {
                    reject(new Error('Could not convert canvas to a Blob'));
                    return;
                }
                const url = URL.createObjectURL(blob);
                resolve(url);
            }, 'image/png');
        });
    } else if (canvas.toDataURL) {
        return Promise.resolve(canvas.toDataURL('image/png'));
    } else {
        return Promise.reject(new Error('cannot convert canvas to URL'));
    }
}
