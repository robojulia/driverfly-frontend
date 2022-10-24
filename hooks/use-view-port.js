import { useMediaQuery } from "react-responsive";

export default function useViewPort() {
    //const isXS = useMediaQuery({ query: `(min-width: 596px)` });
    const isSM = useMediaQuery({ minWidth: 576 }, { orientation: "portrait" });
    const isMD = useMediaQuery({ minWidth: 768 }, { orientation: "portrait" });
    const isLG = useMediaQuery({ minWidth: 992 }, { orientation: "portrait" });
    const isXL = useMediaQuery({ minWidth: 1200 }, { orientation: "portrait" });
    const isXXL = useMediaQuery({ minWidth: 1400 }, { orientation: "portrait" });

    const isXS_Portrait = useMediaQuery({ maxWidth: 575.98 }, { orientation: "landscape" });
    const isSM_Portrait = useMediaQuery({ maxWidth: 767.98 }, { orientation: "landscape" });
    const isMD_Portrait = useMediaQuery({ maxWidth: 991.98 }, { orientation: "landscape" });
    const isLG_Portrait = useMediaQuery({ maxWidth: 1199.98 }, { orientation: "landscape" });
    const isXL_Portrait = useMediaQuery({ maxWidth: 1399.98 }, { orientation: "landscape" });
    //const isXXL_Portrait = useMediaQuery({ query: "(max-width: 575.98px)" });

    
    /*
X-Small	None	<576px
Small	sm	≥576px
Medium	md	≥768px
Large	lg	≥992px
Extra large	xl	≥1200px
Extra extra large	xxl	≥1400px
    */
}