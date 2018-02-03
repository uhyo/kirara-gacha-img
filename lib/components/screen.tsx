import {
    AnyComponent,
    Component,
    ComponentConstructor,
    h,
} from 'preact';

import style from './css/screen.css';

export interface IStateScreen {
    width: number;
    height: number;
}
/**
 * Screen: a wrapper with the size at least same as screen size.
 * provides a scseen context.
 */
export function screen<P extends object, S>(c: AnyComponent<P & IStateScreen, S>):
        ComponentConstructor<P, IStateScreen> {
    const ret = class extends Component<P, IStateScreen> {
        protected handler: (e: UIEvent)=>void;

        constructor(props?: P) {
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
            const {
                width,
                height,
            } = this.state;
            const adhocStyle = {
                minHeight: this.state.height,
                width: this.state.width,
            };
            return (
                <div className={style.screen} style={adhocStyle}>{
                    h<P & IStateScreen>(c, {
                        ... (this.props as object),
                        height,
                        width,
                    } as P & IStateScreen)
                }</div>);
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
    };
    return ret;
}
