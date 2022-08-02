import Script from "next/script";

export function GoogleScript() {
    return (
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-9BHS96Z9P0"
            onLoad={(e) => {
                const dataLayer = window["dataLayer"] = window["dataLayer"] || [];
                function gtag(...args){dataLayer.push(...args);}
                gtag('js', new Date());
                
                gtag('config', "G-9BHS96Z9P0");
            }}
        />
    );
}