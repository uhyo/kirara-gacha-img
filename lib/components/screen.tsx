import {
    Component,
    h,
} from 'preact';

import style from './css/screen.css';

export interface IStateScreen {
    width: number;
    height: number;
}
/**
 * Screen: a wrapper with the size at least same as screen size.
 * provides a flex context.
 */
export class Screen extends Component<{}, IStateScreen> {
    protected elm: Element | undefined;
    protected handler: (e: UIEvent)=>void;
    constructor(props: {}) {
        super(props);

        this.state = {
            height: document.documentElement.clientHeight + 20,
            width: document.documentElement.clientWidth,
        };
        this.handler = (e: UIEvent)=> {
            this.setState({
                height: document.documentElement.clientHeight + 20,
                width: document.documentElement.clientWidth,
            });
        };
    }
    public render() {
        return <div ref={(elm)=> this.elm = elm} className={style.screen} style={{
            minHeight: this.state.height,
            width: this.state.width,
        }}>
            {this.props.children}
        </div>;
    }
    public componentDidMount() {
        this.setState({
            height: document.documentElement.clientHeight + 20,
            width: document.documentElement.clientWidth,
        });
        window.addEventListener('resize', this.handler, false);
    }
    public componentWillUnmount() {
        window.removeEventListener('resize', this.handler, false);
    }
}
