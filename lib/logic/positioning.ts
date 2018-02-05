// Positioning of tiles
import {
    IIconImage,
} from './main';

export interface IPositionInput {
    /**
     * icons
     */
    icons: IIconImage[];
    /**
     * Width of available area.
     */
    width: number;
    /**
     * Zoom.
     */
    zoom: number;
}

export interface IPositionResult {
    /**
     * Required width of area.
     */
    minareawidth: number;
    /**
     * Required height of area.
     */
    height: number;
    /**
     * Maximum width of icons.
     */
    maxwidth: number;
    /**
     * Maximum height of icons.
     */
    maxheight: number;
    /**
     * Number of icons per line.
     */
    num: number;
    /**
     * Padding between icons.
     */
    padding: number;
    /**
     * Start x position of first icon.
     */
    start: number;
}

/**
 * Calculate a positioning of tiles.
 */
export function position({
    icons,
    width,
    zoom,
}: IPositionInput): IPositionResult {
    // number of icons.
    const iconsnum = icons.length;
    // maximum size of icons.
    const sizex = Math.max(... icons.map((box)=> box.width)) * zoom;
    const sizey = Math.max(... icons.map((box)=> box.height)) * zoom;
    // define padding.
    const padding = sizex * 0.05 * zoom;

    //    p[]pp[]pp[]p
    // num * sizex + 2 * num * padding <= width.
    // num * (sizex + 2 * padding) <= width.
    // num <= width / (sizex + 2 * padding).
    let num = Math.floor(width / (sizex + 2 * padding));
    if (num <= 0) {
        // width is 不足.
        // extend required width.
        num = 1;
        width = sizex + 2 * padding;
    }

    // width of icon area.
    const areaw = num * (sizex + 2 * padding);
    // available width for margin.
    const margin = (width - areaw) / 2;

    // number of lines.
    const lines = Math.ceil(iconsnum / num);

    const height = lines * (sizey + 2 * padding);

    return {
        height,
        maxheight: sizey,
        maxwidth: sizex,
        minareawidth: width,
        num,
        padding,
        start: margin,
    };
}
