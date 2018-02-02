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
    IIconImage,
    main,
} from '../logic/main';

type State = 'initial' | 'processing' | 'result';

interface IStateApp {
    state: State;
    icons: IIconImage[];
}

export class App extends Component<{}, IStateApp> {
    constructor(props: {}) {
        super(props);
        this.state = {
            icons: [],
            state: 'initial',
        };
    }
    public render() {
        const {
            state,
            icons,
        } = this.state;

        const fileHandler = async (files: FileList)=>{
            this.setState({
                state: 'processing',
            });
            const iconobjs = await main(files);
            this.setState({
                icons: iconobjs,
                state: 'result',
            });
        };
        return <div>
            <p>
                <FileSelect
                    label='ガチャ画像を選択'
                    onSelect={fileHandler}
                />
            </p>
            {
                state === 'result' ?
                    <ImageShow icons={icons} /> :
                    null
            }
        </div>;
    }
}
