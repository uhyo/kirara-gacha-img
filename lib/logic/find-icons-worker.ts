import {
    IIcon,
    IWorkerResult,
} from './find-icons';

// TypeScript workaround
const ctx: Worker = self as any;

import {
    isBG,
} from './bg';

/**
 * state of scanner.
 */
const enum State {
    Start,
    UpBorder,
    Gacha10_1,
    CenterMargin,
    Gacha1,
}
/**
 * up and down log.
 */
interface IUdlog {
    c: number;
    d: number;
    y: number;
}

ctx.onmessage = (e)=> {
    if (e.data === 'end') {
        close();
        return;
    }
    // Receive an ImageData.
    const {
        data,
        width,
        height,
    } = e.data as ImageData;

    // index of buffer.
    let idx = 0;
    // last bgcnt.
    let last_bgcnt = 0;
    let udlogs: IUdlog[] = [];

    // Scan each line.
    for (let y = 0; y < height; y++) {
        let bgcnt = 0;
        for (let x = 0; x < width; x++) {
            const red = data[idx];
            const green = data[idx+1];
            const blue = data[idx+2];

            if (isBG(red, green, blue)) {
                // this is bg!
                bgcnt++;
            }
            idx += 4;
        }
        // レベル推移判定の閾値
        const lsp = width / 15;
        if (last_bgcnt + lsp < bgcnt) {
            udlogs.push({
                c: bgcnt,
                d: 1,
                y,
            });
        } else if (last_bgcnt - lsp > bgcnt) {
            udlogs.push({
                c: bgcnt,
                d: -1,
                y,
            });
        }
        last_bgcnt = bgcnt;
        // State transition
    }
    udlogs = simplify(udlogs);

    console.log(JSON.stringify(udlogs));
    // End of scanning.
    const result: IIcon[] = [];

    // パターンを検出
    if (matchPattern(udlogs, [1, -1, 1, -1, 1, -1])) {
        // 10連ガチャ
        const linestart = 4 * width * (udlogs[1].y + 20);
        const [xs, sizex] = detectX(data.subarray(linestart, linestart + 4*width), width, 5);
        const y1 = udlogs[1].y - 1;
        const sizey1 = udlogs[2].y - y1;
        for (const x of xs) {
            result.push({
                height: sizey1,
                width: sizex,
                x,
                y: y1,
            });
        }
        const y2 = udlogs[3].y - 1;
        const sizey2 = udlogs[4].y - y2;
        for (const x of xs) {
            result.push({
                height: sizey2,
                width: sizex,
                x,
                y: y2,
            });
        }
    } else if (matchPattern(udlogs, [1, -1, 1, -1])) {
        // 単発ガチャ
        const linestart = 4 * width * (udlogs[1].y + 20);
        const [xs, sizex] = detectX(data.subarray(linestart, linestart + 4*width), width, 1);
        const y1 = udlogs[1].y - 1;
        const sizey1 = udlogs[2].y - y1;
        for (const x of xs) {
            result.push({
                height: sizey1,
                width: sizex,
                x,
                y: y1,
            });
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
        const bgf = isBG(red, green, blue);

        if (bgf) {
            // count continues background pixels.
            bgcont++;
        } else {
            if (bgcont >= 9) {
                // yes, it's after a true background region
                if (result.length < max) {
                    result.push(x);
                }
                if (state === 0) {
                    curx = x;
                    state = 1;
                } else if (state === 1 && curx != null) {
                    sizex = x - bgcont - curx;
                    state = 2;
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

/**
 * simplify given uglods.
 */
function simplify(udlogs: IUdlog[]): IUdlog[] {
    const result: IUdlog[] = [];
    // 近いやつは無視する
    let lasty = 0;
    for (const obj of udlogs) {
        if (obj.y - lasty <= 5) {
            // 近いやつはあとを優先
            result[result.length-1].y = obj.y;
        } else {
            result.push({
                ...obj,
            })
        }
        lasty = obj.y;
    }
    return result;
}

/**
 * checks whether given Udlogs match given pattern.
 */
function matchPattern(udlogs: IUdlog[], pattern: number[]): boolean {
    if (udlogs.length !== pattern.length) {
        return false;
    }
    for (let i = 0; i < udlogs.length; i++) {
        if (udlogs[i].d !== pattern[i]) {
            return false;
        }
    }
    return true;
}
