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

export class IconFinder {
    protected worker = new FindIconWorker();

    /**
     * Find icons from an image.
     */
    public run(image: HTMLImageElement): Promise<IFindIconsResult> {
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
        this.worker.postMessage(data, [data.data.buffer]);

        return new Promise((resolve, reject)=>{
            this.worker.onmessage = (e)=> {
                // tslint:disable-next-line:no-empty
                const noop = ()=> {};
                this.worker.onmessage = noop;
                this.worker.onerror = noop;
                const answer: IWorkerResult = e.data;
                const {
                    result,
                } = answer;

                resolve({
                    image: canvas,
                    result,
                });
            };
            this.worker.onerror = reject;
        });
    }

    /**
     * Terminate our worker.
     */
    public terminate(): void {
        this.worker.postMessage('end');
    }
}
