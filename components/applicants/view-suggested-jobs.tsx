import { useState } from "react";
import { Col } from "react-bootstrap";
import { ApplicantSuggestedJobEntity } from "../../models/applicant";
import ApplicantApi from "../../pages/api/applicant";
import { ViewApplicantDetailProps } from "../../types/applicant/view-application-detail-props.type";
import { useEffectAsync } from "../../utils/react";
import ApplicantConsiderFor from "./applicant-consider-for";
import { CompanyEntity } from "../../models/company/company.entity";

export interface ViewSuggestedJobs extends ViewApplicantDetailProps {
    canEdit?: boolean;
    company?: CompanyEntity;
}

export default function ViewSuggestedJobs({ applicant, company }: ViewSuggestedJobs) {
    const [applicantSuggestedJobs, setApplicantSuggestedJobs] = useState<
        ApplicantSuggestedJobEntity[]
    >([]);

    const applicantApi = new ApplicantApi();

    useEffectAsync(async () => {
        if (applicant?.id) {
            const suggestedJobs = await applicantApi.suggestedJobs.get(applicant.id);
            setApplicantSuggestedJobs(suggestedJobs.filter(job => job?.company?.id == company?.id));
        }
    }, [applicant?.id]);

    return (
        <>
            {applicantSuggestedJobs && (
                <div >
                    <ApplicantConsiderFor
                        applicant={applicant}
                        applicantSuggestedJobs={applicantSuggestedJobs}
                    />
                 </div>
            )}
        </>
    );
}
