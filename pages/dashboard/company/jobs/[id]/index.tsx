import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import ChildPageLayout from "../../../../../components/layouts/page/ChildPageLayout";

import { toast } from "react-toastify";

import { Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { Pencil } from "react-bootstrap-icons";

import { useRouter } from "next/router";
import { useState } from "react";
import { useEffectAsync } from "../../../../../utils/react";
import { useAuth } from "../../../../../hooks/useAuth";
import { useTranslation } from "../../../../../hooks/useTranslation";

import JobApi from "../../../../api/job";
import { JobEntity } from "../../../../../models/job/job.entity";
import { DeleteButton } from "../../../../../components/buttons/DeleteButton";
import { globalAjaxExceptionHandler } from "../../../../../utils/ajax";
import ViewCard from "../../../../../components/viewDetails/viewCard";
import ViewDetails from "../../../../../components/viewDetails/viewDetails";
import { buildAddress } from "../../../../../utils/common";
import { JobEquipmentType } from "../../../../../enums/jobs/job-equipment-type.enum";
import { JobPayMethod } from "../../../../../enums/jobs/job-pay-method.enum";
import { JobBenefits } from "../../../../../enums/jobs/job-benefits.enum";
import { VehicleType } from "../../../../../enums/vehicles/vehicle-type.enum";
import { version } from "os";
import { JobEmploymentType } from "../../../../../enums/jobs/job-employment-type.enum";

import CompanyPhoto from "../../../../../components/jobs/company-photo"
import JobDescription from '../../../../../components/job-description/JobDescription'
import { ArrowRight, GeoAltFill, CurrencyDollar } from "react-bootstrap-icons"
import timeSince from "../../../../../utils/timeSince"
import JobVehicles from "../../../../../components/jobs/job-vehicles"
import JonInformation from '../../../../../components/job-information-sidebar/JobInformation'

export default function ViewJob({ id }) {
    const router = useRouter();

    const { t } = useTranslation();

    const { hasPermission, company } = useAuth();

    const [job, setJob] = useState<JobEntity>(new JobEntity());

    const backPath = "/dashboard/company/jobs";

    const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

    useEffectAsync(async () => {
        if (id) {
            const api = new JobApi();

            const data = await api.getById(+id);

            if (!data || data.company.id !== company?.id) {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: t("JOB") }));
                goBack();
                return;
            }

            setJob(data);
        }
        else {
            toast.error(t("UNABLE_TO_FIND_{name}", { name: "JOB" }, { translateProps: true }));
            goBack();

        }
        
    }, [ id, company ]);

    async function onEditClick() {
        await router.push(router.asPath + `/edit`);
    };

    async function onDeleteClick() {
        try {
            const api = new JobApi();
            await api.remove(+id);
            toast.success(t("Forms.SUCCESS_{action}_{name}", { action: "Forms.Deleted", name: "JOB" }, { translateProps: true }));
            goBack();
        }
        catch (e) {
            globalAjaxExceptionHandler(e, { toast: toast, t: t, defaultMessage: "UNABLE_TO_DELETE"});
        }
    };

    const can = {
        update: hasPermission("CanUpdateJob"),
        delete: hasPermission("CanDeleteJob")
    };

    const title = t("VIEW_{name}", { name: "JOB" }, { translateProps: true });

    return (
        <ChildPageLayout
            backPath={backPath}
            title={title}
            actions={(
                <ButtonGroup>
                {
                    can.delete && 
                    <DeleteButton
                        onDelete={onDeleteClick}
                        />
                }
                {
                    can.update && 
                    <Button type="button" onClick={onEditClick}>
                        <Pencil /> {t("EDIT")}
                    </Button>
                }
                </ButtonGroup>
            )}
        >
            <Row>
                <Col>
                <section className="top-links-sec ort-general">
        <div className="container">
          <div className="row">
            <div className="col-md-9">
              <div className="ort-inner">
                <div className="media align-items-center bg-transparent border-0 p-0">
                  <span className="text-dark text-center text-decoration-none">
                    <CompanyPhoto className="d-flex mr-4 truck-img mb-3" company={job.company} />
                  </span>
                  <div className="media-body">
                    {/* <h6>Solo</h6> */}
                    <h4 className="mt-0">
                      {job.title}
                      <span className="" data-toggle="tooltip"
                        data-placement="top" title={job.title}>
                      </span>
                    </h4>
                    <div className="job-date-author">
                      {
                        job.created_at &&
                        <>
                          {t('posted')} {timeSince(job.created_at)} {t('ago')}
                        </>
                      } {
                        job?.company?.name &&
                        <>
                          {t('by')} <span role="button" className="employer text-theme">{job.company?.name}</span>
                        </>
                      }
                    </div>
                    <div className="job-metas">
                      <div className="job-location d-flex align-items-center">
                        {
                          job.location &&
                          <p className="pr-4">
                            {buildAddress(job.location)}
                          </p>
                        }
                      </div>
                      <div className="job-metas">
                        <p><CurrencyDollar />{job.min_weekly_pay ? job.min_weekly_pay : 0} - {job.max_weekly_pay ? job.max_weekly_pay : 0} {t('per week')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="job-deatails-sec">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                < JobDescription job={job} />
                < JobVehicles job={job} />
              </div>
              <div className="col-lg-4">
                < JonInformation job={job} />
              </div>
            </div>
          </div>
        </div>
      </section>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ViewCard
                        title="basic_details"
                        >
                        <ViewDetails
                            default={t("NOT_SPECIFIED")}
                            obj={{
                                title: job.title,
                                location: buildAddress(job.location),
                                expiration_date: job.expiry_date ? new Date(job.expiry_date).toLocaleDateString() : null,
                                drivers_needed: job.drivers_needed,
                                GEOGRAPHY: job.geography ? t(`JobGeography.${job.geography}`) : null,
                                max_applicant_radius: {
                                    show: !!job.geography,
                                    text: job.max_applicant_radius ? `${job.max_applicant_radius} mi` : null,
                                },
                                SCHEDULE: job.schedule_other ? job.schedule_other : (job.schedule ? t(`JobSchedule.${job.schedule}`) : null),
                                EMPLOYMENT_TYPE: job.employment_type ? t(`JobEmploymentType.${job.employment_type}`) : null,
                                EQUIPMENT_TYPE: job.equipment_type?.map((v, i) => v === JobEquipmentType.OTHER ? job.equipment_type_other : t(`JobEquipmentType.${v}`)),
                                DELIVERY_TYPE: job.delivery_type?.map(v => t(`JobDeliveryType.${v}`)),
                                TEAM_DRIVERS: job.team_drivers ? t(`JobTeamDriver.${job.team_drivers}`) : null,
                            }}
                        />
                    </ViewCard>
                </Col>
                <Col>
                    <ViewCard
                        title="BENEFITS"
                        >
                        <ViewDetails
                            default={t("NOT_SPECIFIED")}
                            obj={{
                                PAY_FREQUENCY: job.pay_frequency ? t(`JobPayFrequency.${job.pay_frequency}`) : null,
                                PAY_METHOD: job.pay_method ? t(`JobPayMethod.${job.pay_method}`) : null,
                                PERCENT_RANGE: {
                                    show: job.pay_method === JobPayMethod.PERCENT_PER_MOVE || job.pay_method === JobPayMethod.PERCENT_PER_WEIGHT,
                                    text: `${job.min_percent}% - ${job.max_percent}%`
                                },
                                MILES_RANGE: {
                                    show: job.pay_method === JobPayMethod.RATE_PER_MILE,
                                    text: `${job.min_miles} mi - ${job.max_miles} mi`
                                },
                                HOUR_RANGE: {
                                    show: job.pay_method === JobPayMethod.HOURLY,
                                    text: `${job.min_hours} hrs - ${job.max_hours} hrs`
                                },
                                RATE_RANGE: {
                                    show: job.pay_method === JobPayMethod.RATE_PER_MILE || job.pay_method === JobPayMethod.HOURLY,
                                    text: `$${job.min_rate} - $${job.max_rate}`
                                },
                                SALARY_RANGE: {
                                    show: job.pay_method === JobPayMethod.SALARY,
                                    text: `$${job.min_salary} - $${job.max_salary}`
                                },
                                WEEKLY_RANGE: `$${job.min_weekly_pay} - $${job.max_weekly_pay}`,
                                BENEFITS: job.benefits?.map(v => v === JobBenefits.OTHER ? job.benefits_other : t(`JobBenefits.${v}`)),
                            }}
                        />
                    </ViewCard>
                </Col>
                <Col>
                    <ViewCard
                        title="vehicle_info"
                    >
                        <ViewDetails
                            default={t("NONE")}
                            obj={{
                                VEHICLES: job.vehicles?.map(veh => ({
                                    TYPE: veh.type === VehicleType.OTHER ? veh.type_other : t(`VehicleType.${veh.type}`),
                                    MAKE: veh.make,
                                    MODEL: veh.model,
                                    TRANSMISSION: veh.transmission_type ? t(`VehicleTransmissionType.${veh.transmission_type}`) : null,
                                    YEAR: veh.year,
                                }))
                            }}
                        />
                    </ViewCard>
                </Col>
            </Row>
            <hr />
            <Row>
                <Col>
                    <ViewCard
                        title="DESCRIPTION"
                    >
                        {job.description}
                    </ViewCard>
                </Col>
            </Row>
            <hr />
            <Row>
                <Col>
                    <ViewCard
                        title="requirements"
                    >
                        <Row>
                            <Col>
                                <ViewDetails
                                    default={t("NOT_SPECIFIED")}
                                    obj={{
                                        MINIMUM_CDL_CLASS: t(`DriverLicenseType.${job.cdl_class || "NONE"}`),
                                        MIN_YEARS_EXPERIENCE: job.min_years_experience ? `${job.min_years_experience} yrs` : null,
                                        min_degree: job.min_degree ? t(`EducationLevel.${job.min_degree}`) : null,
                                        REQUIRED_SKILLS: job.required_skills?.map(v => ({
                                            TYPE: v.type === JobEquipmentType.OTHER ? job.required_skills_other : t(`JobEquipmentType.${v.type}`),
                                            YEARS: v.years
                                        })),
                                        REQUIRED_EQUIPMENT: {
                                            show: job.employment_type === JobEmploymentType.OWNER_OPERATOR,
                                            items: job.required_equipment?.map(v => ({
                                                TYPE: t(`JobEquipmentType.${v.type}`),
                                                QUANTITY: v.quantity
                                            }))
                                        },
                                        special_endorsements: job.required_endorsement?.map(v => t(`DriverEndorsement.${v}`)),
                                        transmission_type: job.transmission_type_experience?.map(v => t(`VehicleTransmissionType.${v}`)),

                                    }}
                                />
                            </Col>
                            <Col>
                            <ViewDetails
                                    default={t("NOT_SPECIFIED")}
                                    obj={{
                                        must_pass_drug_test: job.must_pass_drug_test,
                                        drug_test_type: job.drug_test_type?.map(v => t(`JobDrugTestType.${v}`)),
                                        must_have_clean_mvr: job.must_have_clean_mvr,
                                        MVR_REQUIREMENTS: {
                                            show: !job.must_have_clean_mvr,
                                            items: job.mvr_requirements?.map(v => ({
                                                MAX: v.max_count,
                                                TYPE: t(`MvrType.${v.type}`),
                                                within: v.max_years === 0 ? t("ever") : `${v.max_years} yrs`
                                            }))
                                        },
                                        accept_sap_graduates: job.accept_sap_graduates,
                                        no_criminal_history: job.must_have_clean_criminal_history,
                                        CRIMINAL_HISTORY: {
                                            show: !job.must_have_clean_criminal_history,
                                            items: job.criminal_history?.map(v => ({
                                                MAX: v.max_count,
                                                TYPE: t(`CriminalHistoryType.${v.type}`),
                                                within: v.max_years === 0 ? t("ever") : `${v.max_years} yrs`
                                            }))
                                        },

                                    }}
                                />
                            </Col>
                        </Row>

                    </ViewCard>
                </Col>
            </Row>


        </ChildPageLayout>
    );
}

ViewJob.getLayout = function getLayout(page) {
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
        console.error("ViewApplicant error:", error);
        return { props: { id: null } }
    }
}
