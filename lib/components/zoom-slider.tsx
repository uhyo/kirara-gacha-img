import {
    Component,
    h,
} from 'preact';

import style from './css/zoom-slider.css';

export interface IPropZoomSlider {
    zoom: number;
    onChange?(zoom: number): void;
}

export class ZoomSlider extends Component<IPropZoomSlider, {}> {
    public render() {
        const {
            onChange,
            zoom,
        } = this.props;

        /**
         * Log scale
         */
        const v = Math.round(Math.log2(zoom)*2);

        return <div>
            <input
                type='range'
                className={style.slider}
                step={1}
                min={-4}
                max={4}
                value={String(v)}
                onInput={(e)=>{
                    if (onChange != null) {
                        const val = Number((e.currentTarget as HTMLInputElement).value);
                        onChange(2 ** (val/2));
                    }
                }}
            />
        </div>;
    }
}
