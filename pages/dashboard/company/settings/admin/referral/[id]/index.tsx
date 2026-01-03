import { useRouter } from "next/router";
import { useState } from "react";
import { Button, ButtonGroup, Card, Col, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import { Pencil, PersonFill, CashStack } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { DeleteButton } from "../../../../../../../components/buttons/delete-button";
import { RestoreButton } from "../../../../../../../components/buttons/restore-button";
import FullLayout from "../../../../../../../components/dashboard/layouts/layout/full-layout";
import ChildPageLayout from "../../../../../../../components/layouts/page/child-page-layout";
import ViewDetails from "../../../../../../../components/view-details/view-details";
import ViewDataTable, { ViewTableColumn } from "../../../../../../../components/view-details/view-data-table";
import { Status } from "../../../../../../../enums/status.enum";
import { useAuth } from "../../../../../../../hooks/use-auth";
import { useTranslation } from "../../../../../../../hooks/use-translation";
import { ReferralSourceEntity } from "../../../../../../../models/referral-source/referral-source.entity";
import { ApplicantEntity } from "../../../../../../../models/applicant/applicant.entity";
import { globalAjaxExceptionHandler } from "../../../../../../../utils/ajax";
import { useEffectAsync } from "../../../../../../../utils/react";
import { ReferralSourceApi } from "../../../../../../api/referral-source";
import ApplicantApi from "../../../../../../api/applicant";

export default function ViewReferral({ id, host }) {
    const router = useRouter();

    const { t } = useTranslation();

    const backPath = `/dashboard/company/settings/admin/referral`;

    const { hasPermission, user } = useAuth();

    function goBack(delay?: boolean) {
        if (delay) {
            window.setTimeout(goBack, 2000);
        }

        router.push(backPath);
    }

    const [entity, setEntity] = useState(new ReferralSourceEntity());
    const [applicants, setApplicants] = useState<ApplicantEntity[]>([]);
    const [applicantsLoading, setApplicantsLoading] = useState(false);
    const [referralAmount, setReferralAmount] = useState<number>(0);
    const [isEditingAmount, setIsEditingAmount] = useState(false);
    const [isSavingAmount, setIsSavingAmount] = useState(false);


    useEffectAsync(async () => {
        if (id) {
            const api = new ReferralSourceApi();

            let data = null

            try {
                data = await api.getById(+id);
            }
            catch (e) {
                // silent error for now
                data = null;
            }
            if (!data) {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: t("REFERRAL_SOURCE") }));
                goBack(true);
                return;
            }

            setEntity(data);
            setReferralAmount(data.referralAmount || 0);

            // Fetch applicants for this referral source
            await loadApplicants(+id);
        } else {
            toast.error(t("UNABLE_TO_FIND_{name}", { name: "REFERRAL_SOURCE" }, { translateProps: true }));
            goBack(true);
        }

    }, [user, id]);

    async function loadApplicants(referralSourceId: number) {
        try {
            setApplicantsLoading(true);
            const applicantApi = new ApplicantApi();
            const result = await applicantApi.list({ referralSourceId });

            // Handle both paginated and non-paginated results
            if (Array.isArray(result)) {
                setApplicants(result);
            } else {
                setApplicants(result.items || []);
            }
        } catch (e) {
            console.error("Failed to load applicants:", e);
            setApplicants([]);
        } finally {
            setApplicantsLoading(false);
        }
    }

    async function onEditClick() {
        await router.push(router.asPath + `/edit`);
    };

    async function onDeleteClick() {
        try {
            const api = new ReferralSourceApi();

            const newEntity = await api.remove(entity.id);

            setEntity(newEntity);
        }
        catch (e) {
            globalAjaxExceptionHandler(e, { t: t, toast: toast, defaultMessage: "UNABLE_TO_DELETE" });
        }
    }

    async function onRestoreClick() {
        try {
            const api = new ReferralSourceApi();

            const newEntity = await api.restore(entity.id);

            setEntity(newEntity);
        }
        catch (e) {
            globalAjaxExceptionHandler(e, { t: t, toast: toast, defaultMessage: "UNABLE_TO_RESTORE" });
        }
    }

    async function handleSaveReferralAmount() {
        try {
            setIsSavingAmount(true);
            const api = new ReferralSourceApi();

            const updatedEntity = await api.update(entity.id, {
                ...entity,
                referralAmount: referralAmount
            });

            setEntity(updatedEntity);
            setIsEditingAmount(false);
            toast.success(t("SAVED_SUCCESSFULLY"));
        } catch (e) {
            globalAjaxExceptionHandler(e, { t: t, toast: toast, defaultMessage: "UNABLE_TO_SAVE" });
        } finally {
            setIsSavingAmount(false);
        }
    }

    const renderApplicantName = (applicant: ApplicantEntity) => (
        <div className="d-flex align-items-center">
            <PersonFill className="text-primary me-2" />
            <div>
                <div className="fw-bold">
                    {applicant.first_name && applicant.last_name
                        ? `${applicant.first_name} ${applicant.last_name}`
                        : applicant.email}
                </div>
                <div className="text-muted small">{applicant.email}</div>
            </div>
        </div>
    );

    const applicantColumns: ViewTableColumn<ApplicantEntity>[] = [
        {
            id: "name",
            name: "NAME",
            selector: (row) => `${row.first_name || ''} ${row.last_name || ''}`.trim() || row.email,
            sortable: true,
            minWidth: "250px",
            cell: renderApplicantName,
        },
        {
            id: "phone",
            name: "PHONE",
            selector: (row) => row.phone || '',
            sortable: true,
            minWidth: "150px",
        },
        {
            id: "city",
            name: "CITY",
            selector: (row) => row.city || '',
            sortable: true,
            minWidth: "150px",
        },
        {
            id: "state",
            name: "STATE",
            selector: (row) => row.state || '',
            sortable: true,
            minWidth: "100px",
        },
        {
            id: "created_at",
            name: "APPLIED_DATE",
            selector: (row) => new Date(row.created_at).toLocaleDateString(),
            sortable: true,
            minWidth: "120px",
        },
    ];

    const monthlyTotal = (entity.referrals || 0) * (entity.referralAmount || 0);

    return (
        <ChildPageLayout
            backPath={backPath}
            title={t("VIEW_{name}", { name: "REFERRAL_SOURCE" }, { translateProps: true })}
            actions={
                (<ButtonGroup>
                    {
                        entity.status == Status.ACTIVE &&
                        <DeleteButton
                            onDelete={onDeleteClick}
                        />
                    }
                    {
                        entity.status == Status.DELETED &&
                        <RestoreButton
                            onRestore={onRestoreClick}
                        />
                    }
                    {
                        entity.id &&
                        <Button type="button" onClick={onEditClick}>
                            <Pencil className="me-2" /> {t("EDIT")}
                        </Button>
                    }
                </ButtonGroup>
                )
            }
        >
            <Row>
                <Col>
                    <ViewDetails
                        obj={{
                            ID: entity.id,
                            NAME: entity.name,
                            REFERRAL_CODE: entity.code,
                            SOURCE: entity.source,
                            MEDIUM: entity.medium,
                            URL: entity.code ? ReferralSourceEntity.getReferralUrl(host, entity, user?.company?.slug) : null,
                            REFERRALS: entity.referrals,
                            CREATED_AT: (typeof entity.createdAt == "string" ? new Date(entity.createdAt) : entity.createdAt)?.toLocaleString()
                        }}
                    />
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">
                                <CashStack className="me-2" />
                                Referral Amount & Monthly Total
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Referral Amount per Applicant</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>$</InputGroup.Text>
                                            <Form.Control
                                                type="number"
                                                value={referralAmount}
                                                onChange={(e) => {
                                                    setReferralAmount(parseFloat(e.target.value) || 0);
                                                    setIsEditingAmount(true);
                                                }}
                                                placeholder="0.00"
                                                step="0.01"
                                                min="0"
                                            />
                                        </InputGroup>
                                        <Form.Text className="text-muted">
                                            Set the amount paid per referral for this source
                                        </Form.Text>
                                    </Form.Group>
                                    {isEditingAmount && (
                                        <Button
                                            variant="primary"
                                            className="mt-2"
                                            onClick={handleSaveReferralAmount}
                                            disabled={isSavingAmount}
                                        >
                                            {isSavingAmount ? (
                                                <>
                                                    <Spinner size="sm" animation="border" className="me-2" />
                                                    Saving...
                                                </>
                                            ) : (
                                                'Save Amount'
                                            )}
                                        </Button>
                                    )}
                                </Col>
                                <Col md={6}>
                                    <div className="border rounded p-3 bg-light">
                                        <h6 className="text-muted mb-2">Monthly Total Calculation</h6>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Total Referrals:</span>
                                            <strong>{entity.referrals || 0}</strong>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Amount per Referral:</span>
                                            <strong>${(entity.referralAmount || 0).toFixed(2)}</strong>
                                        </div>
                                        <hr />
                                        <div className="d-flex justify-content-between">
                                            <span className="fw-bold">Monthly Total:</span>
                                            <strong className="text-success fs-5">
                                                ${monthlyTotal.toFixed(2)}
                                            </strong>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">
                                <PersonFill className="me-2" />
                                Applicants ({applicants.length})
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            {applicantsLoading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                                    <Spinner animation="border" />
                                </div>
                            ) : applicants.length === 0 ? (
                                <div className="text-center text-muted py-4">
                                    No applicants found for this referral source
                                </div>
                            ) : (
                                <ViewDataTable<ApplicantEntity>
                                    columns={applicantColumns}
                                    items={applicants}
                                    columnSettingKey="admin.referral.applicants.columns"
                                    description="List of all applicants referred through this source"
                                />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </ChildPageLayout>);
}

ViewReferral.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}


export async function getServerSideProps(context) {
    const { req, query, res, asPath, pathname } = context;
    let host = null;
    if (req) {
        host = req.headers.host // will give you localhost:3000
    }

    try {
        const id = +context.params?.id;
        if (!id)
            return { notFound: true }

        return {
            props: { id: id, host: host }
        }
    } catch (error) {
        console.error("ViewReferralSource error:", error);
        return { props: { id: null, host: host } }
    }
}
