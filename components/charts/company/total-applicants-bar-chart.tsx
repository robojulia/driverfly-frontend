import { ApplicantApi } from "../../../pages/api/applicant";
import { BarChart } from "../bar-chart";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import moment from "moment";

export function TotalApplicantBarChart() {

    const applicantApi = new ApplicantApi();

    const labels: string[] = moment.months().map(v => `MonthsLabel.${v.toUpperCase()}`)
    const yearToShow: number = (new Date()).getFullYear()

    const fetchData = async () => {

        const months = moment.months().map(v => ({ name: v.toUpperCase(), count: 0 }))
        const applicants: ApplicantEntity[] = await applicantApi.list();

        let counts: number[]
        let data = []

        applicants.map(applicant => applicant.jobs.map(applicantJob => {
            if ((!applicantJob.status) || (!applicantJob.created_at)) return;

            const dateApplied = moment(applicantJob.created_at).format('YYYY-MMMM').split("-")
            const year = parseInt(dateApplied[0])
            const month = dateApplied[1].toUpperCase()

            if (!data.some(v => v.year == year)) data.push({ year, months })

            data.map(v => {
                if (v.year != year) return;

                v.months.map(m => { (m.name == month) && m.count++ })
            })

        }))

        data.map(v => {
            if (v.year == yearToShow) counts = v.months.map(v => v.count)
        })

        return counts
    }

    return (
        <BarChart
            yearToShow={yearToShow}
            title="APPLICANTS"
            labels={labels}
            fetchData={fetchData}
        />
    );
}