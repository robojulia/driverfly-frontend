import Script from "next/script";

export default function Scripts() {
    return (
        <>
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-9BHS96Z9P0"
            onLoad={(e) => {
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                
                gtag('config', 'G-9BHS96Z9P0');
            }}
        />
    </>
    )
}

/**
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-9BHS96Z9P0"</script>>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-9BHS96Z9P0');
</script> */