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
    IIconImage,
    main,
} from '../logic/main';

type State = 'initial' | 'processing' | 'result';

interface IStateApp {
    state: State;
    progress: number;
    icons: IIconImage[];
}

export class App extends Component<{}, IStateApp> {
    constructor(props: {}) {
        super(props);
        this.state = {
            icons: [],
            progress: 0,
            state: 'initial',
        };
    }
    public render() {
        const {
            icons,
            progress,
            state,
        } = this.state;

        const fileHandler = async (files: FileList)=>{
            this.setState({
                state: 'processing',
                progress: 0,
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
        return <div>
            <p>
                <FileSelect
                    label='ガチャ画像を選択'
                    onSelect={fileHandler}
                />
            </p>
            {
                state === 'processing' ?
                    <Progress value={progress} label={`処理中… ${(100*progress).toFixed(0)}%`} /> :
                state === 'result' ?
                    <ImageShow icons={icons} /> :
                    null
            }
        </div>;
    }
}
