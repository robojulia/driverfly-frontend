import { useRouter } from "next/router";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import FullLayout from "../../../../../components/dashboard/layouts/layout/full-layout";
import { ApplicantForm } from "../../../../../components/forms/company/applicant-form";
import ChildPageLayout from "../../../../../components/layouts/page/child-page-layout";
import { useTranslation } from "../../../../../hooks/use-translation";
import { ApplicantEntity } from "../../../../../models/applicant/applicant.entity";
import { useEffectAsync } from "../../../../../utils/react";
import ApplicantApi from "../../../../api/applicant";
import OnboardingChecklist from "../../../../../components/applicants/onboarding-checklist";

export default function EditApplicant({ id }) {
    const router = useRouter();
    const { t } = useTranslation();

    const backPath = "/dashboard/company/applicants";
    // const backPath = `/dashboard/company/applicants/${id}`;

    // const goBack = () => window.setTimeout(() => router.push(backPath), 2000);
    const goBack = () => window.setTimeout(() => router.back(), 2000);

    const [applicant, setApplicant] = useState(new ApplicantEntity());

    useEffectAsync(async () => {
        if (id) {
            const api = new ApplicantApi();

            const entity = await api.getById(+id);

            if (entity) setApplicant(entity);
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
            title={t(
                "EDIT_{name}",
                { name: "APPLICANT" },
                { translateProps: true }
            )}
            backPath={backPath}
        >
            <ApplicantForm
                entity={applicant}
                onSaveComplete={goBack}
            />
            {applicant?.id && (
                <Row>
                    <Col>
                        <OnboardingChecklist
                            showHistory
                            title="ONBOARDING_CHECKLIST"
                            applicant={applicant}
                            canEdit={!Boolean(applicant?.is_hired)}
                            showCompleted={true}
                            canEditSafetyPerformance={true}
                            showResendButton={true}
                            onUpdateDocument={(doc) => {
                                setApplicant({
                                    ...applicant,
                                    documents: [...applicant.documents, { ...doc }],
                                });
                            }}
                            onDeleteDocument={(doc) => {
                                const updatedDocuments = applicant.documents?.filter(
                                    (v) => v.id != doc.id
                                );
                                setApplicant({
                                    ...applicant,
                                    documents: [...updatedDocuments],
                                });
                            }}
                        />
                        {/* <ViewApplicantDqf canEdit={true} applicant={applicant} /> */}
                    </Col>
                </Row>
            )}
        </ChildPageLayout>
    );
}

EditApplicant.getLayout = function getLayout(page) {
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
        console.error("EditApplicant error:", error);
        return { props: { id: null } }
    }
}

