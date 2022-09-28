import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from '../../../../hooks/useTranslation';
import React from 'react';
import { ViewApplicantDetailProps } from '../../../../types/applicant/view-application-detail-props.type';
import { useRouter } from 'next/router';
import ViewApplicantDetail from '../../../applicants/applicant-view-details';

export default function Background({ applicant, protectedFields }: ViewApplicantDetailProps) {
    const router = useRouter()
    const { t } = useTranslation();

    const onViewProfileCLick = () => router.push(`/dashboard/company/applicants/${applicant?.id}`)

    return (
        <div className="employee_directory_tabs">
            {applicant && (
                <>
                    <ViewApplicantDetail applicant={applicant} />
                    <Button onClick={onViewProfileCLick}>{t(`view_applicant_profile`)}</Button>
                </>
            )}

        </div>
    )
}
