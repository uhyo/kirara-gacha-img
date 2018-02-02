import {
    renderImage,
} from './render-image';

import {
    extractIcon,
} from './extract-icon';
import {
    findIcons,
    IIcon,
} from './find-icons';

export interface IIconImage extends IIcon {
    id: number;
    url: string;
}

// global id.
let id = 1;

/**
 * The main logic.
 */
export async function main(files: FileList): Promise<IIconImage[]> {
    // Convert to an array.
    const filelist = Array.from(files);
    console.log('filelist', filelist);
    filelist.sort((a, b)=> a.lastModified - b.lastModified);
    // render all images.
    const renderResults =
        await Promise.all(
            filelist.map((file)=> renderImage(file)));
    // remove nulls.
    const images = renderResults.filter((img)=> img != null) as HTMLImageElement[];

    // find gacha icons.
    const icons =
        await Promise.all(
            images.map((image)=> findIcons(image)));

    // Give then ID.
    const result = [];
    for (const obj of icons) {
        const canvas = obj.image;
        for (const box of obj.result) {
            const url = await extractIcon(canvas, box);
            result.push({
                url,
                ...box,
                id: id++,
            });
        }
    }
    return result;
}
