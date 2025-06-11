import { Accordion } from 'react-bootstrap';
import { useTranslation } from '../../hooks/use-translation';
import ViewCard from '../view-details/view-card';
import { buildAddress } from '../../utils/common';
import { AccordionSummary, AccordionDetails } from '@mui/material';
import React from 'react';
import { ArrowsExpand } from 'react-bootstrap-icons';
import { dateRange } from '../../utils/date';
import ViewDetails from '../view-details/view-details';
import { ViewApplicantDetailProps } from '../../types/applicant/view-application-detail-props.type';

interface ApplicantWorkHistoryProps extends ViewApplicantDetailProps { }

export default function ApplicantWorkHistory({ applicant }: ApplicantWorkHistoryProps) {

    const { t } = useTranslation();

    return (
        <ViewCard title="WORK_HISTORY">
            {!applicant.employers?.length &&
                <>{t("NONE")}</>
            }
            {
                <>
                    {applicant.employers.filter(e => !!e.name)?.map((e, i) => (
                        <Accordion key={i}>
                            <AccordionSummary className='p-0'
                                expandIcon={<ArrowsExpand />}
                            >
                                {e.name || t("UNKNOWN")}
                            </AccordionSummary>
                            <AccordionDetails className='p-0'>
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
