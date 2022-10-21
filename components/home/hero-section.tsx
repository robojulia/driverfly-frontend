import { useTranslation } from "../../hooks/useTranslation";
import HeroSearch from "./hero-search";
import TrendingWords from "../trending-words/Trending"

export default function HeroSection() {

    const { t } = useTranslation();

    return (

        <section className="hero-sec">
            <div className="container ">
                <div className="row mt-5">
                    <div className="col-md-12">
                        <div className="hero-inner">
                            <h1>{t("FIND_THE_JOB_THAT_FITS_YOUR_LIFE")}</h1>
                            <h2>{t("CHOOSE_FROM_THOUSANDS_OF_CDL")}</h2>
                        </div>
                        <HeroSearch />
                        <TrendingWords />
                    </div>
                </div>
            </div>
        </section>
    )
}