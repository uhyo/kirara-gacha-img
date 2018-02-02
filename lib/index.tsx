import {
    h,
    render,
} from 'preact';

import './polyfill';

import {
    App,
} from './components/app';

document.addEventListener('DOMContentLoaded', ()=>{
    const app = document.getElementById('app');
    render(<App />, app);
});
