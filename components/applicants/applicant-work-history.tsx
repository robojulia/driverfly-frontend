import { Accordion } from 'react-bootstrap';
import { useTranslation } from '../../hooks/use-translation';
import ViewCard from '../view-details/view-card';
import { buildAddress } from '../../utils/common';
import { AccordionSummary, AccordionDetails } from '@mui/material';
import React, { useState } from 'react';
import { ArrowsExpand, FileEarmarkText, EnvelopeCheck } from 'react-bootstrap-icons';
import { dateRange } from '../../utils/date';
import ViewDetails from '../view-details/view-details';
import { ViewApplicantDetailProps } from '../../types/applicant/view-application-detail-props.type';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ApplicantApi from '../../pages/api/applicant';
import { toast } from 'react-toastify';
import { globalAjaxExceptionHandler } from '../../utils/ajax';
import { LoaderIcon } from '../loading/loader-icon';

interface ApplicantWorkHistoryProps extends ViewApplicantDetailProps {
    onApplicantUpdate?: (updatedApplicant: any) => void;
}

export default function ApplicantWorkHistory({ applicant, onApplicantUpdate }: ApplicantWorkHistoryProps) {

    const { t } = useTranslation();
    const applicantApi = new ApplicantApi();
    const [sendingVoeFor, setSendingVoeFor] = useState<number | null>(null);
    const showVoeSummary = Array.isArray(applicant?.employers)
        && applicant.employers.some((e) => Boolean(e?.can_contact));

    // Sort employers from most recent to oldest
    const sortedEmployers = React.useMemo(() => {
        if (!applicant?.employers) return [];

        return [...applicant.employers]
            .filter(e => !!e.name)
            .sort((a, b) => {
                // Current jobs always come first
                if (a.is_current && !b.is_current) return -1;
                if (!a.is_current && b.is_current) return 1;

                // For non-current jobs, sort by end date (most recent first)
                // If no end date, use start date
                const aDate = a.end_at || a.start_at;
                const bDate = b.end_at || b.start_at;

                if (!aDate && !bDate) return 0;
                if (!aDate) return 1;
                if (!bDate) return -1;

                return new Date(bDate).getTime() - new Date(aDate).getTime();
            });
    }, [applicant?.employers]);

    const handleVoeSummaryClick = () => {
        if (applicant?.uuid_token) {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_API || process.env.BASE_URL_API;
            const voeUrl = `${baseUrl}/applicants/voe/summary/pdf?uuid_token=${applicant.uuid_token}`;
            window.open(voeUrl, '_blank');
        }
    };

    const handleAutoSendVoe = async (employer: any) => {
        if (!employer?.id) return;

        setSendingVoeFor(employer.id);
        try {
            const updatedApplicant = await applicantApi.sendVoeRequest({
                applicant: applicant,
                employer: employer,
            });
            toast.success(t('SUCCESSFULLY_SENT_VOE'));
            if (onApplicantUpdate) {
                onApplicantUpdate(updatedApplicant);
            }
        } catch (e) {
            globalAjaxExceptionHandler(e, { t: t, toast: toast });
        } finally {
            setSendingVoeFor(null);
        }
    };

    const canSendVoe = (employer: any) => {
        const hasEmail = employer?.email && typeof employer.email === 'string' && employer.email.trim() !== '';
        const canContact = employer?.can_contact === true || employer?.can_contact === 'Yes';
        const isSubjectToFmcsrs = employer?.is_subject_to_fmcsrs === true || employer?.is_subject_to_fmcsrs === 'Yes';
        const alreadySent = employer?.voe_attempts > 0 || employer?.auto_voe_attempts > 0;

        return hasEmail && canContact && isSubjectToFmcsrs && !alreadySent;
    };

    const getVoeButtonTooltip = (employer: any) => {
        const hasEmail = employer?.email && typeof employer.email === 'string' && employer.email.trim() !== '';
        const canContact = employer?.can_contact === true || employer?.can_contact === 'Yes';
        const isSubjectToFmcsrs = employer?.is_subject_to_fmcsrs === true || employer?.is_subject_to_fmcsrs === 'Yes';
        const alreadySent = employer?.voe_attempts > 0 || employer?.auto_voe_attempts > 0;

        if (alreadySent) {
            return t('VOE_ALREADY_SENT');
        }
        if (!hasEmail) {
            return t('EMAIL_REQUIRED_FOR_VOE');
        }
        if (!canContact) {
            return t('CONTACT_PERMISSION_REQUIRED_FOR_VOE');
        }
        if (!isSubjectToFmcsrs) {
            return t('FMCSR_CONFIRMATION_REQUIRED_FOR_VOE');
        }
        return t('SEND_VOE_REQUEST_TO_EMPLOYER');
    };

    return (
        <ViewCard 
            title="WORK_HISTORY"
            actions={
                <>
                    {showVoeSummary && (
                        <Button
                            size="sm"
                            onClick={handleVoeSummaryClick}
                            disabled={!applicant?.uuid_token}
                            title={t('GENERATE_VOE_SUMMARY_PDF')}
                        >
                            <FileEarmarkText className="me-1" />
                            VOE Summary
                        </Button>
                    )}
                </>
            }
        >
            {!sortedEmployers?.length &&
                <>{t("NONE")}</>
            }
            {
                <>
                    {sortedEmployers.map((e, i) => (
                        <div key={e.id || i} style={{ marginBottom: '1.5rem' }}>
                            <Accordion>
                                <AccordionSummary className='p-0'
                                    expandIcon={<ArrowsExpand />}
                                >
                                    {e.name || t("UNKNOWN")}
                                    {e.is_current && (
                                        <span className="ms-2 badge bg-success">{t("CURRENT")}</span>
                                    )}
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
                                            EMAIL: e.email,
                                            MAY_CONTACT_COMPANY: e.can_contact,
                                            SUBJECT_TO_FMCSRS: e.is_subject_to_fmcsrs,
                                            JOB_DESIGNATED_AS_SATEFY_SENSITIVE: e.is_subject_to_drug_tests
                                        }}
                                    />
                                    <div className="mt-3 d-flex justify-content-start">
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip id={`tooltip-voe-${i}`}>
                                                    {getVoeButtonTooltip(e)}
                                                </Tooltip>
                                            }
                                        >
                                            <span className="d-inline-block">
                                                <Button
                                                    size="sm"
                                                    variant={canSendVoe(e) ? "primary" : "secondary"}
                                                    disabled={!canSendVoe(e) || sendingVoeFor === e.id}
                                                    onClick={() => handleAutoSendVoe(e)}
                                                    style={!canSendVoe(e) ? { pointerEvents: 'none' } : {}}
                                                >
                                                    {sendingVoeFor === e.id ? (
                                                        <>
                                                            <LoaderIcon isLoading={true} /> {t('SENDING')}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EnvelopeCheck className="me-1" />
                                                            {t('AUTO_SEND_VOE')}
                                                        </>
                                                    )}
                                                </Button>
                                            </span>
                                        </OverlayTrigger>
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                    ))}</>}
        </ViewCard>
    )
}
