import {
    Component,
    h,
} from 'preact';

import {
    IIconImage,
} from './logic/main';

export interface IPropImageShow {
    icons: IIconImage[];
}

export class ImageShow extends Component<IPropImageShow, {}> {
    public render() {
        const {
            icons,
        } = this.props;

        return <div>{
            icons.map((box)=> {
                return <img key={String(box.id)} src={box.url} width={box.width} height={box.height} />;
            })
        }</div>;
    }
}
