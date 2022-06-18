import { BarChart } from "../BarChart";
import { ApplicantApi } from "../../../pages/api/applicant";
import { ApplicantStatus } from "../../../enums/applicants/applicant-status.enum";

export function ApplicantPipelineChart() {
    const fetchData = async () => {
        const api = new ApplicantApi();

        let leads = 0;
        let inProcess = 0;
        let hired = 0;

        const applicants = await api.list();

        applicants.forEach(v => {
            v.jobs.forEach(j => {
                switch (j.status) {
                    case ApplicantStatus.LEAD:
                    case ApplicantStatus.APPLIED:
                        leads++;
                        break;
                    case ApplicantStatus.HIRED:
                        hired++;
                        break;
                    case ApplicantStatus.REJECTED:
                    case ApplicantStatus.WITHDRAWN:
                        break;
                    default:
                        inProcess++;
                        break;
                }
            });
        });
        return [leads, inProcess, hired];
    };

    const labels = [ "LEADS", "IN_PROCESS", "HIRED" ].map(v => `ApplicantPipelineChartLabel.${v}`);

    return (
        <BarChart
            title="APPLICANTS"
            labels={labels}
            fetchData={fetchData}
            />
    );
}