import {
    Component,
    h,
} from 'preact';

import './css/app.css';

import {
    FileSelect,
} from './file-select';
import {
    ImageShow,
} from './image-show';
import {
    Progress,
} from './progress';
import {
    ZoomSlider,
} from './zoom-slider';

import {
    IIconImage,
    main,
} from '../logic/main';

type State = 'initial' | 'processing' | 'result';

interface IStateApp {
    icons: IIconImage[];
    progress: number;
    state: State;
    zoom: number;
}

export class App extends Component<{}, IStateApp> {
    constructor(props: {}) {
        super(props);
        this.state = {
            icons: [],
            progress: 0,
            state: 'initial',
            zoom: 1,
        };
    }
    public render() {
        const {
            icons,
            progress,
            state,
            zoom,
        } = this.state;

        const fileHandler = async (files: FileList)=>{
            this.setState({
                progress: 0,
                state: 'processing',
            });
            const stream = main(files);
            for await (const obj of stream) {
                console.log(obj);
                if (obj == null) {
                    continue;
                }
                if (obj.type === 'progress') {
                    this.setState({
                        progress: obj.current / obj.max,
                        state: 'processing',
                    });
                } else if (obj.type === 'result') {
                    this.setState({
                        icons: obj.result,
                        state: 'result',
                    });
                }
            }
        };
        let tile;
        if (state === 'processing') {
            tile =
                (<Progress
                    value={progress}
                    label='処理中…'
                    />) ;
        } else {
            tile =
                (<FileSelect
                    label={state === 'result' ? 'もう1度ガチャ画像を選択' : 'ガチャ画像を選択'}
                    onSelect={fileHandler}
                />);
        }
        let zoomtile;
        if (state === 'result') {
            const zoomChange = (v: number)=> {
                this.setState({
                    zoom: v,
                });
            };
            zoomtile = (<ZoomSlider
                zoom={zoom}
                onChange={zoomChange}
                />);
        }
        return <div>
            <div>
                {tile}
            </div>
            {zoomtile}
            {
                state === 'result' ?
                    <ImageShow icons={icons} zoom={zoom} /> :
                    null
            }
        </div>;
    }
}
