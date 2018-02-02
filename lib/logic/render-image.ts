/**
 * Render given file as an image.
 */
export function renderImage(file: File): Promise<HTMLImageElement | null> {
    const u = URL.createObjectURL(file);

    const img = document.createElement('img');
    img.src = u;

    return new Promise((resolve, reject)=>{
        img.addEventListener('load', ()=>{
            console.log(img.naturalWidth, img.naturalHeight);
            resolve(img);
        });
        img.addEventListener('error', (err)=>{
            console.error(err);
            resolve(null);
        });
    });
}
