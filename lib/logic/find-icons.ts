import FindIconWorker from 'worker-loader!./find-icons-worker';

export interface IIcon {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface IFindIconsResult {
    image: HTMLCanvasElement;
    result: IIcon[];
}

export interface IWorkerResult {
    data: ImageData;
    result: IIcon[];
}

/**
 * Find icons from an image.
 */
export function findIcons(image: HTMLImageElement): Promise<IFindIconsResult> {
    // Invoke a worker.
    const worker = new FindIconWorker();

    // Render image into a canvas.
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
        throw new Error('Could not get a context');
    }
    ctx.drawImage(image, 0, 0);
    // Retrieve an ImageData.
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Send this data to the worker.
    worker.postMessage(data, [data.data.buffer]);

    return new Promise((resolve, reject)=>{
        worker.onmessage = (e)=> {
            const answer: IWorkerResult = e.data;
            const {
                result,
            } = answer;
            console.log(result);
            resolve({
                image: canvas,
                result,
            });
        };
        worker.onerror = reject;
    });
}
