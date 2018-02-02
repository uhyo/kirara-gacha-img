import {
    renderImage,
} from './render-image';

import {
    findIcons,
} from './find-icons';

/**
 * The main logic.
 */
export async function main(files: FileList) {
    // Convert to an array.
    const filelist = Array.from(files);
    // render all images.
    const results =
        await Promise.all(
            filelist.map((file)=> renderImage(file)));
    // remove nulls.
    const images = results.filter((img)=> img != null) as HTMLImageElement[];

    // find gacha icons.
    const icons =
        await Promise.all(
            images.map((image)=> findIcons(image)));

    for (const obj of icons) {
        const canvas = obj.image;
        const ctx = canvas.getContext('2d')!;
        for (const box of obj.result) {
            ctx.clearRect(box.x, box.y, box.width, box.height);
        }
        const div = document.createElement('div');
        div.appendChild(canvas);
        document.body.appendChild(div);
    }
}
