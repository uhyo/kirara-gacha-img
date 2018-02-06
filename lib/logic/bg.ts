/**
 * background color of the gacha board.
 */
export const bg = {
    blue: 0xff,
    green: 0xd7,
    red: 0xaa,
};
// b2d6f8 : 8 + 1 + 8 = 17

/**
 * Check whether this color is BG.
 */
export function isBG(red: number, green: number, blue: number): boolean {
    const diff = Math.abs(red - bg.red) + Math.abs(green - bg.green) + Math.abs(blue - bg.blue);

    // Firefox has weird rendering!
    // JPEG images may come!
    return diff < 24;
}
