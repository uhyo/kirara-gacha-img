import {
    IIcon,
    IWorkerResult,
} from './find-icons';

// TypeScript workaround
const ctx: Worker = self as any;

// background color of the gacha board.
const bg = {
    blue: 0xff,
    green: 0xd7,
    red: 0xaa,
};

// state of scanner.
const enum State {
    Start,
    UpBorder,
    Gacha10_1,
    CenterMargin,
    Gacha1,
}

ctx.onmessage = (e)=> {
    // Receive an ImageData.
    const {
        data,
        width,
        height,
    } = e.data as ImageData;

    // index of buffer.
    let idx = 0;
    // states.
    let s = State.Start;
    let y1: number | undefined;
    let xs: number[] | undefined;
    let y2: number | undefined;
    let sizex: number | undefined;
    let sizey: number | undefined;

    // Scan each line.
    wholeloop: for (let y = 0; y < height; y++) {
        let bgcnt = 0;
        for (let x = 0; x < width; x++) {
            const red = data[idx];
            const green = data[idx+1];
            const blue = data[idx+2];

            if (red === bg.red && green === bg.green && blue === bg.blue) {
                // this is bg!
                bgcnt++;
            }
            idx += 4;
        }
        console.log(bgcnt);
        // State transition
        switch (s) {
            case State.Start: {
                if (bgcnt >= 650) {
                    // Found a board.
                    s = State.UpBorder;
                }
                break;
            }
            case State.UpBorder: {
                if (80 <= bgcnt && bgcnt <= 150) {
                    // Found a 10 gacha.
                    // Start of first line.
                    y1 = y - 1;
                    s = State.Gacha10_1;

                    // Get start position of each boxes.
                    const linestart = 4 * width * (y+10);
                    [xs, sizex] = detectX(data.subarray(linestart, linestart + 4 * width), width, 5);
                } else if (bgcnt <= 640) {
                    // Found a 1 gacha.
                    y1 = y - 1;
                    s = State.Gacha1;

                    const linestart = 4 * width * (y+10);
                    [xs, sizex] = detectX(data.subarray(linestart, linestart + 4 * width), width, 1);
                }
                break;
            }
            case State.Gacha10_1: {
                if (bgcnt >= 650) {
                    // End of gacha1.
                    sizey = y - y1!;
                    s = State.CenterMargin;
                }
                break;
            }
            case State.CenterMargin: {
                if (80 <= bgcnt && bgcnt <= 150) {
                    // Start of second line.
                    y2 = y - 1;
                    // Job is done!
                    break wholeloop;
                }
                break;
            }
            case State.Gacha1: {
                if (bgcnt >= 650) {
                    sizey = y - y1!;
                    break wholeloop;
                }
                break;
            }
        }
    }

    // End of scanning.
    const result: IIcon[] = [];
    if (sizex != null && sizey != null) {
        if (y1 != null && xs != null) {
            for (const x of xs) {
                result.push({
                    height: sizey,
                    width: sizex,
                    x,
                    y: y1,
                });
            }
        }
        if (y2 != null && xs != null) {
            for (const x of xs) {
                result.push({
                    height: sizey,
                    width: sizex,
                    x,
                    y: y2,
                });
            }
        }
    }

    const answer: IWorkerResult = {
        data: e.data,
        result,
    };

    ctx.postMessage(answer, [data.buffer]);
};

/**
 * Detect each box of gacha icon.
 */
function detectX(data: Uint8ClampedArray, width: number, max: number): [number[], number] {
    const result = [];
    let curx: number | undefined;
    let sizex: number | undefined;

    let state = 0;
    let bgcont = 0;

    for (let x = 0; x < width; x++) {
        const idx = x * 4;
        const red = data[idx];
        const green = data[idx+1];
        const blue = data[idx+2];
        const bgf = red === bg.red && green === bg.green && blue === bg.blue;

        console.log(bgf, bgcont);
        if (bgf) {
            // count continues background pixels.
            bgcont++;
            if (bgcont === 1 && state === 1 && curx != null) {
                // it's the end of the first box.
                sizex = x - curx;
                state = 2;
            }
        } else {
            if (bgcont >= 12) {
                // yes, it's after a true background region
                if (result.length < max) {
                    console.log('found!', x, state);
                    result.push(x);
                }
                if (state === 0) {
                    curx = x;
                    state = 1;
                }
            }
            bgcont = 0;

        }
    }
    if (sizex != null) {
        return [result, sizex];
    } else {
        throw new Error('Something went wrong');
    }
}
