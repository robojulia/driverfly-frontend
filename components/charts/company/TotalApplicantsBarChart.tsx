import { ApplicantApi } from "../../../pages/api/applicant";
import { ApplicantStatus } from "../../../enums/applicants/applicant-status.enum";
import { Badge } from "react-bootstrap";
import { BarChart } from "../BarChart";

export function TotalApplicantBarChart() {
    const fetchData = async () => {
        const api = new ApplicantApi();

        let january = 0;
        let february = 0;
        let march = 0;

        const applicants = await api.list();

        applicants.forEach(v => {
            v.jobs.forEach(j => {
                if (!j.status) return;
                if (j.status.startsWith("NEW_")) january++;
                else if (j.status.startsWith("IN_PROCESS_")) february++;
                else if (j.status.startsWith("COMPLETED_")) march++;
            });
        });
        return [january, february, march];
    };

    const labels = [ "JAN", "FEB", "MAR","ARP","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC" ].map(v => `TotalApplicantsBarChartLabel.${v}`);

    return (
        <BarChart
            title="APPLICANTS"
            labels={labels}
            fetchData={fetchData}
            />
    );
}