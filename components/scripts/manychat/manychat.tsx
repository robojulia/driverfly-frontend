import Head from "next/head";

export function ManyChatScript() {

    return (
        <Head>
            {/* <!-- ManyChat --> */}
            <script src="//widget.manychat.com/108914868289684.js" defer={true}></script>
            <script src="https://mccdn.me/assets/js/widget.js" defer={true}></script>
        </Head>
    );
}

export function ManyChatWidget() {
    return (
        <div className="mcwidget-embed" data-widget-id="333935" />
    );
}