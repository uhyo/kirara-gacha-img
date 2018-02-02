// Symbol.asyncIterator Polyfill
if (!Symbol) {
    Symbol = {
        asyncIterator: '______Symbol$asyncIterator',
    } as any;
} else if (!Symbol.asyncIterator) {
    (Symbol as any).asyncIterator = Symbol('Symbol.asyncIterator');
}
