import {
    Component,
    h,
} from 'preact';

import {
    IIconImage,
} from '../logic/main';

import {
    Screen,
} from './screen';

import style from './css/image-show.css';

export interface IPropImageShow {
    icons: IIconImage[];
    zoom: number;
}

export class ImageShow extends Component<IPropImageShow, {}> {
    public render() {
        const {
            icons,
            zoom,
        } = this.props;

        return <Screen>
            <div className={style.wrapper}>{
                icons.map((box)=> {
                    const margin = (box.height * 0.1 * zoom).toFixed(1);
                    const styleobj = {
                        margin: `${margin}px`,
                    };

                    return <img
                        key={String(box.id)}
                        style={styleobj}
                        className={style.icon}
                        src={box.url}
                        width={zoom * box.width}
                        height={zoom * box.height}
                        />;
                })
            }</div>
        </Screen>;
    }
}
