import {
    Component,
    h,
} from 'preact';

import style from './css/file-select.css';
import tileStyle from './css/tile.css';

import {
    Button,
} from './button';

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

        return (
            <Button
                disabled={disabled}
                onClick={this.handleClick.bind(this)}>
                {label}
            </Button>);
    }
    protected handleClick(): void {
        // File select button is clicked.
        const {
            onSelect,
        } = this.props;

        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'image/*';
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
