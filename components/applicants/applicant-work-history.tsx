import { Accordion } from 'react-bootstrap';
import { useTranslation } from '../../hooks/useTranslation';
import ViewCard from '../viewDetails/viewCard';
import { buildAddress } from '../../utils/common';
import { ViewApplicantDetailProps } from '../../types/applicant/view-application-detail-props.type';
import { AccordionSummary, AccordionDetails } from '@mui/material';
import React from 'react';
import { ArrowsExpand } from 'react-bootstrap-icons';
import { dateRange } from '../../utils/date';
import ViewDetails from '../viewDetails/viewDetails';

export default function WorkHistory({ applicant }: ViewApplicantDetailProps) {

    const { t } = useTranslation();

    return (
        <ViewCard title="WORK_HISTORY">
            {!applicant.employers?.length &&
                <>{t("NONE")}</>
            }
            {
                <>
                    {applicant.employers?.map((e, i) => (
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ArrowsExpand />}
                            >
                                {e.name || t("UNKNOWN")}
                            </AccordionSummary>
                            <AccordionDetails>
                                <ViewDetails
                                    key={i}
                                    default={t("NOT_ANSWERED")}
                                    obj={{
                                        NAME: e.name,
                                        DATES_EMPLOYED: dateRange(e.start_at, e.end_at, t("PRESENT")),
                                        TITLE: e.title,
                                        ADDRESS: buildAddress(e),
                                        PHONE: e.phone,
                                        MAY_CONTACT_COMPANY: e.can_contact,
                                        SUBJECT_TO_FMCSRS: e.is_subject_to_fmcsrs,
                                        JOB_DESIGNATED_AS_SATEFY_SENSITIVE: e.is_subject_to_drug_tests
                                    }}
                                />
                            </AccordionDetails>
                        </Accordion>
                    ))}</>}
        </ViewCard>
    )
}
