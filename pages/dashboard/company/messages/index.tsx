import { CancelTokenSource } from "axios";
import FullLayout from "../../../../components/dashboard/layouts/layout/full-layout";
import PageLayout from "../../../../components/layouts/page/page-layout";
import { Messenger } from "../../../../components/messenger/messenger";
import { ChattableType } from "../../../../enums/conversation/chattable-type.enum";
import { useTranslation } from "../../../../hooks/use-translation";
import ApplicantApi from "../../../api/applicant";
import EmployeeApi from "../../../api/employee";

export default function MessageList() {
    const { t } = useTranslation();

    const getOptions = async (query: string, cancellationToken: CancelTokenSource) => {
        // const applicantApi = new ApplicantApi();
        // const employeeApi = new EmployeeApi();

        // const names = query.split(' ').filter((name) => name);
        // const [first_name, last_name] = names
        // console.log("[first_name, last_name]", first_name, last_name);

        // function hasNumber(myString) {
        //     return /\d/.test(myString);
        // }

        // const applicants = (await applicantApi.search({
        //     first_name,
        //     last_name: last_name || first_name,
        //     // email: query,
        //     phone: hasNumber(query) ? query : null
        // }, {
        //     cancelToken: cancellationToken.token
        // }))?.filter(ap => !!ap?.phone);
        // const employees = (await employeeApi.search({
        //     last_name: query,
        //     first_name: query,
        //     phone: query,
        // }, {
        //     cancelToken: cancellationToken.token
        // }))?.filter(ap => !!ap?.phone);

        return [
            // ...applicants?.map(v => ({
            //     // text: `${v.first_name} ${v.last_name} (${t("ChattableType." + Boolean(v?.user?.id) ? ChattableType.USER : ChattableType.APPLICANT)}) `,
            //     text: `${v.first_name} ${v.last_name} (${t("ChattableType." + ChattableType.APPLICANT)})`,
            //     value: {
            //         chattable_type: Boolean(v.user) ? ChattableType.USER : ChattableType.APPLICANT,
            //         chattable_id: v.user?.id || v.id,
            //         chattable_name: v.user?.name || `${v.first_name} ${v.last_name}`
            //     }
            // })),
            // ...employees?.map(v => ({
            //     text: `${v.first_name} ${v.last_name} (${t("ChattableType." + ChattableType.EMPLOYEE)})`,
            //     value: {
            //         chattable_type: ChattableType.EMPLOYEE,
            //         chattable_id: v.id,
            //         chattable_name: `${v.first_name} ${v.last_name}`
            //     }
            // })),

        ];
    };

    return (
        <PageLayout
            title="SMS_MESSAGES"
        >
            <Messenger
                getOptions={getOptions}
            />
        </PageLayout>
    )

};

MessageList.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
