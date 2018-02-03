import {
    Component,
    ComponentConstructor,
    h,
} from 'preact';

import {
    IIconImage,
} from '../logic/main';
import {
    position,
} from '../logic/positioning';

import {
    screen,
} from './screen';

import style from './css/image-show.css';

export interface IPropImageShow {
    icons: IIconImage[];
    zoom: number;
}
interface IPropImageShowInner extends IPropImageShow {
    width: number;
    height: number;
}

class ImageShowInner extends Component<IPropImageShowInner, {}> {
    public render() {
        const {
            width,
            icons,
            zoom,
        } = this.props;

        // get maximum of icons.
        const sizex = Math.max(... icons.map((box)=> box.width)) * zoom;
        const padding = sizex * 0.05 * zoom;

        const {
            start,
        } = position({
            padding,
            sizex,
            width,
        });

        const adhocStyle = {
            paddingLeft: `${start}px`,
            paddingRight: `${start}px`,
        };

        return (<div className={style.wrapper} style={adhocStyle}>{
            icons.map((box)=> {
                const margin = (box.height * 0.1 * zoom).toFixed(1);
                const styleobj = {
                    margin: `${padding}px`,
                };

                return (<img
                    key={String(box.id)}
                    style={styleobj}
                    className={style.icon}
                    src={box.url}
                    width={zoom * box.width}
                    height={zoom * box.height}
                />);
            })
        }</div>);
    }
}

export const ImageShow = screen<IPropImageShow, {}>(ImageShowInner as ComponentConstructor<IPropImageShowInner, {}>);
