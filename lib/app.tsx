import {
    Component,
    h,
} from 'preact';

import {
    FileSelect,
} from './file-select';

import {
    main,
} from './logic/main';

export class App extends Component<{}, {}> {
    public render() {
        const fileHandler = (files: FileList)=>{
            main(files);
        };
        return <div>
            <p>
                <FileSelect
                    label='ガチャ画像を選択'
                    onSelect={fileHandler}
                />
            </p>
        </div>;
    }
}
