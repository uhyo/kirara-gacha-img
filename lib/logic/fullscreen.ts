// Polyfilling fullscreen.

/**
 * Returns whether fullscreen is currently enabled.
 */
export function isFullscreen(): boolean {
    return document.webkitFullscreenElement != null ||
        (document as any).mozFullScreenElement != null ||
        document.fullscreenElement != null;
}

/**
 * Request fullscreen for given element.
 */
export function requestFullscreen(elm: Element): void {
    alert('req ' + elm.webkitRequestFullscreen);
    if (elm.requestFullscreen) {
        elm.requestFullscreen();
    } else if ((elm as any).mozRequestFullScreen) {
        (elm as any).mozRequestFullScreen();
    } else if (elm.webkitRequestFullscreen) {
        elm.webkitRequestFullscreen();
    }
}

/**
 * Exit fullscreen.
 */
export function exitFullscreen(): void {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
    }
}
