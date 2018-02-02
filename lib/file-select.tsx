import {
    Component,
    h,
} from 'preact';

export interface IPropFileSelect {
    label: string;
    onSelect(files: FileList): void;
}

/**
 * File select button.
 */
export class FileSelect extends Component<IPropFileSelect, {}> {
    public render() {
        const {
            label,
        } = this.props;

        return <button onClick={this.handleClick.bind(this)}>
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

        setTimeout(()=>{
            input.click();
            setTimeout(()=>{
                document.body.removeChild(input);
            }, 500);
        }, 0);

    }
}
