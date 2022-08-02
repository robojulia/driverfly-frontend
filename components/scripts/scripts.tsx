import { GoogleScript } from "./google/google";
import { ManyChatScript } from "./manychat/manychat";

export function Scripts() {
    return (
        <>
            <GoogleScript />
            {/* <!-- ManyChat --> */}
            <script src="//widget.manychat.com/108914868289684.js" defer={true}></script>
            <script src="https://mccdn.me/assets/js/widget.js" defer={true}></script>
        </>
    );
}