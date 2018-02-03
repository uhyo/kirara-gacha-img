import {
    renderImage,
} from './render-image';

import {
    EventStream,
} from './event-stream';
import {
    extractIcon,
} from './extract-icon';
import {
    IconFinder,
    IIcon,
} from './find-icons';

/**
 * Event for any progress.
 */
export type IProgress = {
    type: 'progress';
    current: number;
    max: number;
} | {
    type: 'result';
    result: IIconImage[];
};

export interface IIconImage extends IIcon {
    id: number;
    url: string;
}

// global id.
let id = 1;

/**
 * The main logic.
 */
export function main(files: FileList): EventStream<IProgress> {
    return new EventStream(async (emit, end, error)=> {
        // Convert to an array.
        const filelist = Array.from(files);
        filelist.sort((a, b)=> a.lastModified - b.lastModified);
        // render all images.
        const renderResults =
            await Promise.all(
                filelist.map((file)=> renderImage(file)));
        // remove nulls.
        const images = renderResults.filter((img)=> img != null) as HTMLImageElement[];

        const finder = new IconFinder();

        const result: IIconImage[] = [];
        let count = 0;

        // find gacha icons.
        for (const image of images) {
            const obj = await finder.run(image);
            count++;
            if (count < images.length) {
                // not full!
                emit({
                    current: count,
                    max: images.length,
                    type: 'progress',
                });
            }
            for (const box of obj.result) {
                const url = await extractIcon(obj.image, box);
                result.push({
                    url,
                    ...box,
                    id: id++,
                });
            }
        }
        // full!
        emit({
            result,
            type: 'result',
        });
        finder.terminate();
        end();
    });
}
