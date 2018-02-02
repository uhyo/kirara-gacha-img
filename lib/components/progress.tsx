import {
    Component,
    h,
} from 'preact';

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

        return <div>
            {label}
        </div>;
    }
}
