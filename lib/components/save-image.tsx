import {
    Component,
    h,
} from 'preact';

import {
    Button,
} from './button';

import {
    download,
} from '../logic/download';
import {
    EventStream,
} from '../logic/event-stream';
import {
    IIconImage,
} from '../logic/main';
import {
    IPackProgress,
    packImage,
} from '../logic/pack-image';

export interface IPropSaveImage {
    icons: IIconImage[];
    zoom: number;
    onSaving(stream: EventStream<IPackProgress>): void;
}

/**
 * Save image button.
 */
export class SaveImage extends Component<IPropSaveImage, {}> {
    public render() {
        const click = ()=> {
            const {
                icons,
                onSaving,
                zoom,
            } = this.props;
            const width = document.documentElement.clientWidth;

            const stream = packImage(this.props.icons, width, zoom);
            onSaving(stream);
        };
        return (
            <Button
                onClick={click}
            >
                画像を保存
            </Button>);
    }
}
