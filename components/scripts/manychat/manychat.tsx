import Script from "next/script";

export function ManyChatScript() {
    return (
        <>
        <script
            defer
            src={`//widget.manychat.com/108914868289684.js`}
            />
        <script
            defer
            src="https://mccdn.me/assets/js/widget.js"
            />
        </>
    );
}

export function ManyChatWidget() {
    return (
        <div className="mcwidget-embed" data-widget-id="333935" />
    );
}