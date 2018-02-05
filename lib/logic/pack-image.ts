import {
    bg,
} from './bg';
import {
    EventStream,
} from './event-stream';
import {
    IIconImage,
} from './main';
import {
    position,
} from './positioning';

export type IPackProgress = {
    type: 'progress';
    current: number;
    max: number;
} | {
    type: 'end';
    canvas: HTMLCanvasElement;
};
/**
 * Pack icons into one image.
 */
export function packImage(icons: IIconImage[], width: number, zoom: number): EventStream<IPackProgress> {
    // determine あれ.
    const {
        height,
        maxwidth,
        maxheight,
        minareawidth,
        num,
        padding,
        start,
    } = position({
        icons,
        width,
        zoom,
    });
    console.log({
        height,
        maxwidth,
        maxheight,
        minareawidth,
        num,
        padding,
        start,
    });

    return new EventStream(async (emit, end, err)=> {
        // pixel ratio.
        const ratio = window.devicePixelRatio || 1;

        // prepare canvas.
        const canvas = document.createElement('canvas');
        canvas.width = minareawidth * ratio;
        canvas.height = height * ratio;

        const ctx = canvas.getContext('2d');
        if (ctx == null) {
            throw new Error('Cannot get the context.');
        }

        // fill it with bg.
        ctx.fillStyle = `rgb(${bg.red}, ${bg.green}, ${bg.blue})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // paste images according to data.
        let x = 0;
        let y = 0;
        let count = 0;
        for (const icon of icons) {
            const dx = ratio * (start + padding + (maxwidth + 2 * padding) * x);
            const dy = ratio * (padding + (maxheight + 2 * padding) * y);

            const img = await getImage(icon.url);
            ctx.drawImage(img, dx, dy, icon.width*zoom*ratio, icon.height*zoom*ratio);
            emit({
                current: count,
                max: icons.length,
                type: 'progress',
            });

            x++;
            if (x >= num) {
                x = 0;
                y++;
            }
            count++;
        }
        emit({
            canvas,
            type: 'end',
        });
        end();
        console.log(canvas);
    });
}

function getImage(url: string): Promise<HTMLImageElement> {
    const img = document.createElement('img');
    img.src = url;
    return new Promise((resolve, reject)=> {
        img.addEventListener('load', ()=> {
            resolve(img);
        }, false);
        img.addEventListener('error', ()=> {
            reject(new Error('error while loading image'));
        }, false);
    });
}
