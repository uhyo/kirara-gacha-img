import {
    Component,
    ComponentConstructor,
    h,
} from 'preact';

import {
    IIconImage,
} from '../logic/main';

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
            icons,
            zoom,
        } = this.props;

        return (<div className={style.wrapper}>{
            icons.map((box)=> {
                const margin = (box.height * 0.1 * zoom).toFixed(1);
                const styleobj = {
                    margin: `${margin}px`,
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
