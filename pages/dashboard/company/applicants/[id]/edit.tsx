import { useRouter } from "next/router";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import OnboardingChecklist from "../../../../../components/applicants/onboarding-checklist";
import FullLayout from "../../../../../components/dashboard/layouts/layout/full-layout";
import { EditApplicantForm } from "../../../../../components/forms/company/edit-applicant-form";
import ChildPageLayout from "../../../../../components/layouts/page/child-page-layout";
import { useTranslation } from "../../../../../hooks/use-translation";
import { ApplicantEntity } from "../../../../../models/applicant/applicant.entity";
import { useEffectAsync } from "../../../../../utils/react";
import ApplicantApi from "../../../../api/applicant";

export default function EditApplicant({ id }) {
    const router = useRouter();
    const { t } = useTranslation();

    const backPath = "/dashboard/company/applicants";

    const goBack = () => window.setTimeout(() => router.back(), 2000);

    const [applicant, setApplicant] = useState(new ApplicantEntity());
    const [refetchApplicant, setRefetchApplicant] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
    }, [id, refetchApplicant]);

    const onSaveComplete = () => {
        setRefetchApplicant(!refetchApplicant)
    }

    return (
        <ChildPageLayout
            title={t(
                "EDIT_{name}",
                { name: "APPLICANT" },
                { translateProps: true }
            )}
            backPath={backPath}
        >

            <EditApplicantForm
                entity={applicant}
                setEntity={setApplicant}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
                onSaveComplete={onSaveComplete}
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

