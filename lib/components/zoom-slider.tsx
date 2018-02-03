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
        const v = Math.ceil(Math.log2(zoom));

        return <div>
            <input
                type='range'
                className={style.slider}
                value={String(v)}
                step={1}
                min={-2}
                max={2}
                onInput={(e)=>{
                    if (onChange != null) {
                        const val = Number((e.currentTarget as HTMLInputElement).value);
                        onChange(2 ** val);
                    }
                }}
            />
        </div>;
    }
}
