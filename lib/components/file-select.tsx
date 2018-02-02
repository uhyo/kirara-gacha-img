import {
    Component,
    h,
} from 'preact';

import style from './css/file-select.css';
import tileStyle from './css/tile.css';

export interface IPropFileSelect {
    disabled?: boolean;
    label: string;
    onSelect(files: FileList): void;
}

/**
 * File select button.
 */
export class FileSelect extends Component<IPropFileSelect, {}> {
    public render() {
        const {
            disabled,
            label,
        } = this.props;

        return <button
            className={tileStyle.tile + ' ' + style.button}
            disabled={disabled}
            onClick={this.handleClick.bind(this)}>
            {label}
        </button>;
    }
    protected handleClick(): void {
        // File select button is clicked.
        const {
            onSelect,
        } = this.props;

        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.style.display = 'none';

        input.addEventListener('change', ()=>{
            if (input.files != null) {
                onSelect(input.files);
            }
        }, false);

        document.body.appendChild(input);

        input.click();
    }
}
