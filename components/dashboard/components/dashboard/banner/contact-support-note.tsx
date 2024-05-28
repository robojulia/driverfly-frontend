import Link from "next/link";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { Question } from "react-bootstrap-icons";
import { useAuth } from "../../../../../hooks/use-auth";
import { useTranslation } from "../../../../../hooks/use-translation";

export default function ContactSupportNote() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">{t("CONTACT_SUPPORT")}</Popover.Header>
      <Popover.Body>
        {t("CONTACT_SUPPORT_MESSAGE_THROUGH")}&nbsp;
        <Link legacyBehavior href={`/dashboard/company/settings/support`}>
          {t("CONTACT_SUPPORT_MESSAGE_LINK")}
        </Link>
        &nbsp;{t("CONTACT_SUPPORT_MESSAGE_EMAIL")}&nbsp;
        <Link legacyBehavior href={`mailto:help@driverfly.co`}>
          help@driverfly.co
        </Link>
        .
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      {(!!user || !!user?.company) && (
        <div className="contact-support">
          <OverlayTrigger trigger="click" placement="top-end" overlay={popover}>
            <Question className="question-mark" />
          </OverlayTrigger>
        </div>
      )}
    </>
  );
}
