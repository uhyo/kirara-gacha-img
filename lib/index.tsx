import {
    h,
    render,
} from 'preact';

import {
    App,
} from './app';

document.addEventListener('DOMContentLoaded', ()=>{
    const app = document.getElementById('app');
    render(<App />, app);
});
