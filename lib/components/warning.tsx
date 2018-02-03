import {
    Component,
    h,
} from 'preact';

import style from './css/warning.css';

import {
    Button,
} from './button';

export interface IPropWarning {
    onClose(): void;
}
/**
 * いろいろな注意書き
 */
export function Warning({
    onClose,
}: IPropWarning): JSX.Element {
    return (<div className={style.wrapper}>
        <ul>
            <li>複数のスクリーンショットをまとめて選択してください。</li>
            <li>ガチャ結果ではない画像は無視されます。</li>
            <li>選択したスクリーンショットが端末から送信されることはありません。</li>
            <li>動作確認済み環境はPCのChrome, FirefoxとiOS (iPhone6s)です。</li>
            <li><strong>生成された画像の利用は自己の責任で行ってください。</strong></li>
        </ul>
        <div>
            <Button
                additionalClass={style.closebutton}
                onClick={onClose}
            >
                閉じる
            </Button>
        </div>
    </div>);

}
