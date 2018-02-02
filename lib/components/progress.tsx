import {
    Component,
    h,
} from 'preact';

import style from './css/progress.css';
import tileStyle from './css/tile.css';

export interface IPropProgress {
    label: string;
    value: number;
}
/**
 * Progress bar.
 */
export class Progress extends Component<IPropProgress, {}> {
    public render() {
        const {
            label,
            value,
        } = this.props;

        const green = '#88ee88';
        const brd = Math.floor(100*value);
        const background =
            `linear-gradient(to right, ${green}, ${green} ${brd}%, transparent ${brd}%, transparent), #dddddd`;

        return <div
            className={tileStyle.tile + ' ' + style.progress}
            style={{
                background,
            }}
            >
            {label}
        </div>;
    }
}
