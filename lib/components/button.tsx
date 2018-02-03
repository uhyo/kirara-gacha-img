import {
    Component,
    h,
} from 'preact';

import tileStyle from './css/tile.css';

export interface IPropButton {
    additionalClass?: string;
    disabled?: boolean;
    onClick?(): void;
}

/**
 * Stretching button.
 */
export class Button extends Component<IPropButton, {}> {
    public render(){
        const {
            additionalClass,
            children,
            disabled,
            onClick,
        } = this.props;
        return (
            <button
                className={tileStyle.button + (additionalClass ? ` ${additionalClass}` : '')}
                disabled={disabled}
                onClick={onClick}>
                {children}
            </button>);
    }
}
