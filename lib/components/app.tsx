import {
    Component,
    h,
} from 'preact';

import style from './css/app.css';

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
    SaveImage,
} from './save-image';
import {
    Warning,
} from './warning';
import {
    ZoomSlider,
} from './zoom-slider';

import {
    download,
} from '../logic/download';
import {
    EventStream,
} from '../logic/event-stream';
import {
    IIconImage,
    main,
} from '../logic/main';
import {
    IPackProgress,
} from '../logic/pack-image';

type State = 'initial' | 'processing' | 'result' | 'saving';

interface IStateApp {
    icons: IIconImage[];
    progress: number;
    saveLink: string | null;
    state: State;
    warning: boolean;
    zoom: number;
}

export class App extends Component<{}, IStateApp> {
    constructor(props: {}) {
        super(props);

        // initial zoom is decided by available size
        const zoom =
            document.documentElement.clientWidth < 600 ? 0.5 : 1;
        this.state = {
            icons: [],
            progress: 0,
            saveLink: null,
            state: 'initial',
            warning: true,
            zoom,
        };
    }
    public render() {
        const {
            icons,
            progress,
            saveLink,
            state,
            warning,
            zoom,
        } = this.state;

        const fileHandler = async (files: FileList)=>{
            this.setState({
                progress: 0,
                state: 'processing',
            });
            const stream = main(files);
            for await (const obj of stream) {
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
        const saveHandler = async (stream: EventStream<IPackProgress>)=> {
            this.setState({
                progress: 0,
                state: 'saving',
            });
            for await (const obj of stream) {
                if (obj == null) {
                    continue;
                }
                if (obj.type === 'progress') {
                    this.setState({
                        progress: obj.current / obj.max,
                        state: 'saving',
                    });
                } else if (obj.type === 'end') {
                    // download it.
                    const url = await download(obj.canvas);
                    if (url != null) {
                        this.setState({
                            saveLink: url,
                            state: 'result',
                        });
                    } else {
                        this.setState({
                            saveLink: null,
                            state: 'result',
                        });
                    }
                }
            }
        };
        const warningClose = ()=> {
            this.setState({
                warning: false,
            });
        };
        let zoomtile;
        if (state === 'result' || state === 'saving') {
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
            {warning ?
                <Warning onClose={warningClose} /> :
                null}
            {state === 'processing' || state === 'saving' ?
                <Progress
                    value={progress}
                    label='処理中…'
                /> :
                null}
            <div className={style.tiles}>
                {state === 'initial' ?
                    <FileSelect
                        label='ガチャ画像を選択'
                        onSelect={fileHandler}
                    /> :
                    state === 'result' ?
                    <FileSelect
                        label='もう1度ガチャ画像を選択'
                        onSelect={fileHandler}
                    /> :
                    null}
                {state === 'result' && icons.length > 0 ?
                    <SaveImage
                        icons={icons}
                        zoom={zoom}
                        onSaving={saveHandler}
                    /> :
                    null
                }
            </div>
            {saveLink != null ?
                <p><a href={saveLink} target='_blank'>画像をダウンロード</a></p> :
                null}
            {zoomtile}
            {
                state === 'result' || state === 'saving' ?
                (icons.length > 0 ?
                    <ImageShow icons={icons} zoom={zoom} /> :
                    <p>ガチャ結果の画像が見つかりませんでした。</p>) :
                    null
            }
        </div>;
    }
}
