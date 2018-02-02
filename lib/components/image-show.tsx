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
}

export class ImageShow extends Component<IPropImageShow, {}> {
    public render() {
        const {
            icons,
        } = this.props;

        return <Screen>
            <div className={style.wrapper}>{
                icons.map((box)=> {
                    return <img
                        key={String(box.id)}
                        className={style.icon}
                        src={box.url}
                        width={box.width}
                        height={box.height}
                        />;
                })
            }</div>
        </Screen>;
    }
}
