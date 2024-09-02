import 'bootstrap/dist/css/bootstrap.css'
import { useState } from "react"
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'
import ApplicantApi from "../../api/applicant"
import { GetServerSidePropsContext } from 'next'
import { toast } from "react-toastify";
import { ApplicantEntity, ApplicantSuggestedJobEntity } from '../../../models/applicant'
import { useTranslation } from '../../../hooks/use-translation'
import { useEffectAsync } from '../../../utils/react'

export default function FindJobs({ applicant }) {


    const applicantApi = new ApplicantApi()
    const { t } = useTranslation();

    const [jobs, setJobs] = useState<ApplicantSuggestedJobEntity[]>([])

    const fetchJobs = async (): Promise<void> => {
        try {

            await applicantApi.jotform.suggestedJobs(applicant.id)
                .then((data) => {
                    console.log({ data });
                    setJobs(data)
                })
        } catch (e) {
            toast.error(t('FIND_JOB_ERROR_GENERAL'))
        }
    }

    useEffectAsync(async (): Promise<void> => {
        try {
            await fetchJobs()
        } catch (e) {
            toast.error(t('FIND_JOB_ERROR_GENERAL'))
        }
    }, [])

    return (
        <div className="filter-sec">
            <div className="container">
                <div className="row">
                    <div className="col-md-9 outer pl-4 ">
                        Suggested Jobs
                        {/* < JobsList /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
    try {
        const { applicant_uuid } = query || {} as any;

        if (!!!applicant_uuid) return { notFound: true };

        const applicantApi = new ApplicantApi();
        const applicant: ApplicantEntity = await applicantApi
            .fetchByUuidToken(
                applicant_uuid,
                {
                    withRelations: [
                        "company",
                    ]
                });

        if (!!!applicant) return { notFound: true };

        return { props: { applicant } };
    } catch (error) {
        return { notFound: true };
    }
}
