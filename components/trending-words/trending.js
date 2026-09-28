import Link from "next/link";
import { useTranslation } from "../../hooks/use-translation";

// Search matches job title/description by substring, so each keyword is a short term that returns results.
const TRENDING_KEYWORDS = [
    "CDL",
    "Class A",
    "Local",
    "Regional",
    "OTR",
    "Owner Operator",
    "Flatbed",
    "Reefer",
    "Dry Van",
    "Hotshot",
    "Drayage",
];

export default function TrendingWords() {
    const { t } = useTranslation();

    return (
        <>
            <div className="content-trending ">
                <ul className="trending-keywords">
                    <li className="title">{t("TRENDING_KEYWORDS")}</li>
                    {TRENDING_KEYWORDS.map((keyword, index) => (
                        <li className="item" key={keyword}>
                            <Link href={{ pathname: "/find-jobs", query: { keywords: keyword } }}>
                                <a>{keyword}{index < TRENDING_KEYWORDS.length - 1 ? "," : ""}</a>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}
