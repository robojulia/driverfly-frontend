import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffectAsync } from "../../../../../../utils/react";
import ChildPageLayout from "../../../../../../components/layouts/page/child-page-layout";
import { useTranslation } from "../../../../../../hooks/use-translation";
import FullLayout from "../../../../../../components/dashboard/layouts/layout/full-layout";
import EmployeeApi from "../../../../../api/employee";
import { EmployeeEntity } from "../../../../../../models/employee/employee.entity";
import { EmployeeForm } from "../../../../../../components/forms/company/employee-form";

export default function EditEmployee({ id }) {
    const router = useRouter();
    const { t } = useTranslation();

    const backPath = `/dashboard/company/compliance/employee-directory`;


    const goBack = () => window.setTimeout(() => router.push(backPath), 2000);
    // const goBack = () => window.setTimeout(() => router.back(), 2000);

    const [employee, setEmployee] = useState<EmployeeEntity>(new EmployeeEntity());

    useEffectAsync(async () => {
        if (id) {
            const api = new EmployeeApi();

            const entity = await api.getById(+id, ['notes', 'notes.user']);

            if (entity) setEmployee(entity);
            else {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: "APPLICANT" }, { translateProps: true }));
                goBack();
            }
        } else {
            toast.error(t("UNABLE_TO_FIND_{name}", { name: "APPLICANT" }, { translateProps: true }));
            goBack();
        }
    }, [id]);

    return (
        <ChildPageLayout
            title={t("EDIT_{name}", { name: "Employee" }, { translateProps: true })}
            backPath={backPath}
        >
            {employee?.first_name && employee?.last_name && (
                <div className="px-2 mb-3">
                    <h4 style={{ fontWeight: 'bold' }}>
                        {employee.first_name} {employee.last_name}
                    </h4>
                </div>
            )}
            <EmployeeForm entity={employee} />
        </ChildPageLayout>
    );
}

EditEmployee.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}

export async function getServerSideProps(context) {
    try {
        const id = +context.params?.id;
        if (!id)
            return { notFound: true }

        return {
            props: { id: id }
        }
    } catch (error) {
        console.error("Edit Employee error:", error);
        return { props: { id: null } }
    }
}

