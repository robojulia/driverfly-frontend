import { Accordion, Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from '../../hooks/useTranslation';
import { JobEntity } from "../../models/job/job.entity";
import React, { useState } from 'react';
import ViewModal from '../viewDetails/viewModal';
import { useAuth } from '../../hooks/useAuth'
import { JobEquipmentType } from '../../enums/jobs/job-equipment-type.enum';
import applicant from '../../pages/api/applicant';
import { calculateAge, dateRange } from '../../utils/date';
import ViewCard from '../viewDetails/viewCard';
import ViewDetails from '../viewDetails/viewDetails';
import { AccordionSummary, AccordionDetails } from '@mui/material';
import { ArrowsExpand } from 'react-bootstrap-icons';
import { buildAddress } from '../../utils/common';
import ViewTable from '../viewDetails/viewTable';
import DocumentApi from '../../pages/api/document';


export interface UploadedDocumentsProps {
    className?: string;
    job: JobEntity;
    relatedJobs?: React.ReactNode;
    canApply?: boolean | (() => boolean);
    canSave?: boolean | (() => boolean);
    hideVehicles?: boolean | (() => boolean);
    hideCompanyName?: boolean | (() => boolean);
    hideSocialLinks?: boolean | (() => boolean);
    viewAllJobsLink?: string;
}


export default function UploadedDocuments({ applicant }) {

    const { t } = useTranslation();
    const [encourageModal, setEncourageModal] = React.useState(false)
    const { user } = useAuth();
    const [pdf, setPdf] = useState({});

    const viewDocumentClick = async (id, name) => {
        const api = new DocumentApi();

        const document = await api.getSignedUrl(id);

        if (document) {
            setPdf({
                name: `${t(name)} (${document.name})`,
                url: document.path
            });
        }
    }
    return (
        <ViewCard title="UPLOADED_DOCUMENTS">
            <ViewTable
                type="DOCUMENTS"
                headers={{
                    type: "TYPE",
                    document: "DOCUMENT",
                    date_added: "DATE_ADDED"
                }}
                items={
                    applicant?.documents?.map(document => ({
                        type: t(`ApplicantDocumentType.${document.type}`),
                        document: <a onClick={() => viewDocumentClick(document.id, document.name)} href="#">{document.name}</a>,
                        date_added: new Date(document.created_at).toDateString()
                    }))}
            />
        </ViewCard>
    )
}
