import CompanyApi from '../../pages/api/company';
import { useEffect, useState, useMemo } from 'react'


export default function CompanyJobsCount({ companyId, label, className }) {

    const companyApi = useMemo(() => new CompanyApi(), []);
    const [jobsCount, setJobsCount] = useState(0);

    useEffect(() => {
        const fetchJobCount = async () => {
            await companyApi.employer.getJobCount(companyId)
                .then(data => setJobsCount(data))
                .catch(function (error) {
                    console.log("handle error success", error.response)
                })
        }
        fetchJobCount()
    }, [companyApi, companyId]);

    return (
        <span className={className}>
            {jobsCount}  {label}
        </span>
    )
}
