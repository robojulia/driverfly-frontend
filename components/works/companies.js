import { CheckSquare, Pencil, SearchHeart } from 'react-bootstrap-icons';
import { useTranslation } from '../../hooks/use-translation';


export default function Companies() {
    const { t } = useTranslation();

    return (
        <>
            <h3>{t("COMPANIES")}</h3>
            <div className="row">
                <div className="col-md-4">
                    <div className="card">

                        < Pencil />
                        <div className="card-body px-0">
                            <h5 className="card-title">{t("POST_A_JOB")}</h5>
                            <p className="card-text">{t("POST_A_JOB_MATCH_WITH_RIGHT_DRIVERS")}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        < SearchHeart />
                        <div className="card-body px-0">
                            <h5 className="card-title">{t("SEARCH_DRIVERS")}</h5>
                            <p className="card-text">{t("BROWSE_PROFILE")}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        < CheckSquare />
                        <div className="card-body px-0">
                            <h5 className="card-title">{t("HIRE")}</h5>
                            <p className="card-text">{t("EXTEND_AN_OFFER_LETTER_AND_CONDUCT_BACKGROUND")}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
