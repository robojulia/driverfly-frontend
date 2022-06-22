import CompanyApi from '../../pages/api/company';
import { useEffect, useState } from 'react'


export default function CompanyJobsCount({ companyId, label, className }) {

    const companyApi = new CompanyApi();
    const [jobsCount, setJobsCount] = useState(0);

    useEffect(async () => {
        await companyApi.employer.getJobCount(companyId)
            .then(data => setJobsCount(data))
            .catch(function (error) {
                console.log("handle error success", error.response)
            })
    }, []);

    return (
        <span className={className}>
            {jobsCount}  {label}
        </span>
    )
}
