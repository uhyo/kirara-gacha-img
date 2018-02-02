/**
 * Streams given event.
 */
export class EventStream<T> implements AsyncIterableIterator<T | undefined> {
    /**
     * Pending results.
     */
    protected queue: T[] = [];
    /**
     * Error state.
     */
    protected err: any;
    /**
     * Done state.
     */
    protected done: boolean = false;

    protected waiting: ((result: IteratorResult<T | undefined>)=> void) | undefined;
    protected waitingErr: ((err: any)=> void) | undefined;

    constructor(callback?: (emit: (value: T)=>void, end: ()=>void, error: (err: any)=>void)=>Promise<void>) {
        if (callback != null) {
            const emit = this.emit.bind(this);
            const end = this.end.bind(this);
            const error = this.emitError.bind(this);
            callback(emit, end, error)
            .catch((err)=> {
                this.emitError(err);
            });
        }
    }
    /**
     * Emit an event.
     */
    public emit(value: T): void {
        if (this.done) {
            throw new Error('Cannot add a new value to an ended stream');
        }
        if (this.waiting != null) {
            const f = this.waiting;
            this.waiting = undefined;
            f({
                done: false,
                value,
            });
        } else {
            this.queue.push(value);
        }
    }
    /**
     * Notify the end of stream.
     */
    public end(): void {
        this.done = true;
        if (this.waiting != null) {
            const f = this.waiting;
            this.waiting = undefined;
            f({
                done: true,
                value: undefined,
            });
        }
    }
    /**
     * Emit an error.
     */
    public emitError(err: any): void {
        this.err = err;
        if (this.waitingErr != null) {
            const f = this.waitingErr;
            this.waiting = undefined;
            f(err);
        }
    }

    public [Symbol.asyncIterator](): this {
        return this;
    }
    public next(): Promise<IteratorResult<T | undefined>> {
        if (this.err != null) {
            return Promise.reject(this.err);
        }
        if (this.done) {
            return Promise.resolve({
                done: true,
                value: undefined,
            });
        }
        if (this.queue.length > 0) {
            const value = this.queue.pop()!;
            return Promise.resolve({
                done: false,
                value,
            });
        }
        if (this.waiting != null) {
            return Promise.reject(new Error('duplicate next() call'));
        }
        return new Promise((resolve, reject)=> {
            this.waiting = resolve;
            this.waitingErr = reject;
        });
    }
}
