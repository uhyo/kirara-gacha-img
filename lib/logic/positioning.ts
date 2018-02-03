// Positioning of tiles

export interface IPositionInput {
    /**
     * Padding between icons.
     */
    padding: number;
    /**
     * Width of icons.
     */
    sizex: number;
    /**
     * Width of available area.
     */
    width: number;
}

export interface IPositionResult {
    /**
     * Number of icons per line.
     */
    num: number;
    /**
     * Start x position of first icon.
     */
    start: number;
}

/**
 * Calculate a positioning of tiles.
 */
export function position({
    padding,
    sizex,
    width,
}: IPositionInput): IPositionResult {
    //    p[]pp[]pp[]p
    // num * sizex + 2 * num * padding <= width.
    // num * (sizex + 2 * padding) <= width.
    // num <= width / (sizex + 2 * padding).
    const num = Math.floor(width / (sizex + 2 * padding));

    // width of icon area.
    const areaw = num * (sizex + 2 * padding);
    // available width for margin.
    const margin = (width - areaw) / 2;

    return {
        num,
        start: margin,
    };
}
