import {
  FileEarmarkZip,
  Funnel,
  CheckSquare,
  Bell,
  Trophy,
  HandIndexThumb,
} from "react-bootstrap-icons";
import { useTranslation } from "../../hooks/use-translation";
import Link from "next/link";

export default function Driver() {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="general-headings">
        {t("HOW_IT_WORK")}
      </h2>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="how-it-work-sections card">
            <FileEarmarkZip />
            <div className="card-body px-0">
              <h5 className="card-title">{t("CREATE_AN_ACCOUNT")}</h5>
              <p className="card-text">
                {t("TAKE_5_MINUTES_TO_QUICKLY_SET_UP")}
              </p>
              <p className="registration_link">
                {" "}
                <Link href="/signup">
                  <a className="mx-1" style={{ textDecoration: "none" }}>
                    {t("REGISTER_TODAY")}
                  </a>
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="how-it-work-sections card">
            <Funnel />
            <div className="card-body px-0">
              <h5 className="card-title">{t("FILTER_&_SEARCH_DRIVER_JOBS")}</h5>
              <p className="card-text">
                {t("BROWSE_HUNDREDS_OF_JOBS_ON_YOIR_SPECIFIC_CRITERIA")}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="how-it-work-sections card">
            <CheckSquare />
            <div className="card-body px-0">
              <h5 className="card-title">{t("SAVE_&_APPLY")}</h5>
              <p className="card-text">
                {t("USE_THE_DRIVERFLY_PLATFORM_TO_FAVORITE_JOBS")}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="how-it-work-sections card">
            <Bell />
            <div className="card-body px-0">
              <h5 className="card-title">{t("HAVE_JOBS_COME_TO_YOU")}</h5>
              <p className="card-text">
                {t("YOU_ALSO_HAVE_THE_ABILITY_TO_DISPLAY_YOUR_PROFILE")}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="how-it-work-sections card">
            <Trophy />
            <div className="card-body px-0">
              <h5 className="card-title">{t("GET_HIRED")}</h5>
              <p className="card-text">{t("EMPLOYERS_WILL_CONTACT_YOU")}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="how-it-work-sections card">
            <HandIndexThumb />
            <div className="card-body px-0">
              <h5 className="card-title">{t("REVIEW_YOUR_EMPLOYER")}</h5>
              <p className="card-text">
                {t("ONCE_YOU'VE_LANDED_YOUR_DREAM_JOB")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
