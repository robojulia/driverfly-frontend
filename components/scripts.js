import Script from "next/script";

export default function Scripts() {
    return (
        <>
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-BQCDFNKTDZ"
            onLoad={(e) => {
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                
                gtag('config', 'G-BQCDFNKTDZ');
            }}
        />
    </>
    )
}

/**
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-BQCDFNKTDZ"</script>>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-BQCDFNKTDZ');
</script> */