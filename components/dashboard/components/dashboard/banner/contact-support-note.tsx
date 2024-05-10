import { useState } from "react";
import { Question } from "react-bootstrap-icons";
import { useAuth } from '../../../../../hooks/use-auth';
import { useTranslation } from "../../../../../hooks/use-translation";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import OverlyPopover from "../../../../popover/overly-popover";

export default function ContactSupportNote() {

    const { user } = useAuth();
    const { t } = useTranslation();

    const [showMessage, setShowMessage] = useState<boolean>(false);

    return (
        <>
            {
                (!!user || !!user?.company) &&
                <div className="contact-support" onMouseEnter={() => setShowMessage(true)} onMouseLeave={() => setShowMessage(false)}>
                    <OverlyPopover
                        placement="top"
                        trigger={['hover', 'click']}
                        str="CONTACT_SUPPORT">
                        <Question className="question-mark" />
                    </OverlyPopover>

                </div>
            }
        </>
    )
}
