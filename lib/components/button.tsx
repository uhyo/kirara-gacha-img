import {
    Component,
    h,
} from 'preact';

import tileStyle from './css/tile.css';

export interface IPropButton {
    disabled?: boolean;
    onClick?(): void;
}

/**
 * Stretching button.
 */
export class Button extends Component<IPropButton, {}> {
    public render(){
        const {
            children,
            disabled,
            onClick,
        } = this.props;
        return (
            <button
                className={tileStyle.button}
                disabled={disabled}
                onClick={onClick}>
                {children}
            </button>);
    }
}
