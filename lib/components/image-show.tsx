import {
    Component,
    ComponentConstructor,
    h,
} from 'preact';

import {
    exitFullscreen,
    isFullscreen,
    requestFullscreen,
} from '../logic/fullscreen';
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
    protected elm: Element | undefined;
    protected handleClick: (e: Event)=> void;
    constructor(props: IPropImageShowInner) {
        super(props);

        this.handleClick = (e)=> {
            const {
                elm,
            } = this;
            if (elm != null) {
                if (isFullscreen()) {
                    exitFullscreen();
                } else {
                    requestFullscreen(elm);
                }
            }
        };
    }
    public render() {
        const {
            width,
            icons,
            zoom,
        } = this.props;

        const {
            padding,
            start,
        } = position({
            icons,
            width,
            zoom,
        });

        const adhocStyle = {
            paddingLeft: `${start}px`,
            paddingRight: `${start}px`,
        };

        return (<div
            ref={(elm)=> this.elm = elm}
            className={style.wrapper}
            style={adhocStyle}
            onClick={this.handleClick}>{
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
