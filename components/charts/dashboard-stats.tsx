import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useContext, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import DashboardChartContext from "../../context/dashboard-chart-context";
import { EmployeeStatus } from "../../enums/applicants/employee-status.enum";
import { useTranslation } from "../../hooks/use-translation";
import { EmployeeEntity } from "../../models/employee/employee.entity";
import newApplicantIcon from "../../public/img/new_appicants_this_week.svg";
import totalEmployeesIcon from "../../public/img/total_employees.svg";
import totalHiresIcon from "../../public/img/total_hires_this_month.svg";
import { isBirthdayThisWeek } from "../../utils/date";

type StatAttributes = {
    value?: number;
    text?: string;
    element?: JSX.Element;
    link?: string;
    onClick?: (e?: any) => void;
    icon?: any;
};

export const DashboardStats = () => {
    const { state } = useContext(DashboardChartContext);
    const [showBdaysList, setShowBdaysList] = useState<boolean>(false);

    const { t } = useTranslation();
    const [birthdayDetails, setBirthdayDetails] = useState<EmployeeEntity[]>([]);

    const fetchData = () => {
        const applicants = state?.applicants || [];
        const employees = state?.employees || [];
        const jobs = state?.jobs || [];
        const today = new Date();
        const currentWeek = moment().isoWeek();

        const stats: {
            NEW_LEADS?: StatAttributes;
            TOTAL_LEADS?: StatAttributes;
            TOTAL_ACTIVE_EMPLOYEE?: StatAttributes;
            EMPLOYEE_BIRTHDAYS?: StatAttributes;
            ACTIVE_JOB_POSTS?: StatAttributes;
            CONVERSION_RATE?: StatAttributes;
        } = applicants?.reduce(
            (acc, a) => {
                if (!a.is_hired && a?.current_application_status?.startsWith("NEW_")) {
                    acc.TOTAL_LEADS.value++;
                    if (moment(a?.created_at).isoWeek() == currentWeek) {
                        acc.NEW_LEADS.value++;
                    }
                }
                return acc;
            },

            {
                NEW_LEADS: {
                    value: 0,
                    link: "/dashboard/company/applicants",
                    icon: newApplicantIcon,
                },
                TOTAL_LEADS: {
                    value: 0,
                    link: "/dashboard/company/applicants",
                    icon: totalHiresIcon,
                },
                TOTAL_ACTIVE_EMPLOYEE: {
                    value: employees?.filter((v) => v?.status == EmployeeStatus.ACTIVE)
                        ?.length,
                    link: "/dashboard/company/compliance/employee-directory",
                    icon: totalEmployeesIcon,
                },
                EMPLOYEE_BIRTHDAYS: {
                    value: 0,
                },
                ACTIVE_JOB_POSTS: {
                    value: jobs?.length,
                    link: "/dashboard/company/jobs",
                },
                CONVERSION_RATE: {
                    text: "0%",
                },
            }
        );

        employees?.forEach((a) => {
            const birthdate: Date = new Date(a.birthdate);

            if (isBirthdayThisWeek(birthdate)) {
                stats.EMPLOYEE_BIRTHDAYS.value++;
                const isDuplicate = birthdayDetails?.some((itm) => {
                    return (
                        itm.birthdate == a.birthdate && itm.first_name == a.first_name
                    );
                });
                if (!isDuplicate) setBirthdayDetails((prevVal) => [...prevVal, a]);
            }
        });
        const conversionRate =
            (applicants?.filter((a) => Boolean(a?.is_hired))?.length /
                applicants?.length) *
            100;
        stats.CONVERSION_RATE.text = conversionRate
            ? Number(conversionRate?.toFixed(2)) + "%"
            : "-";
        return stats;
    };

    const data = useMemo(() => {
        return fetchData();
    }, [state]);

    return (
        <div className={`py-3 container-fluid`}>
            <Row
                className=" my-2 py-2 company_dashobard"
                style={{ borderRadius: "30px", background: "#FFFFFF" }}
            >
                {Object?.entries(data)
                    ?.slice(0, 3)
                    ?.map(([key, value], index) => (
                        <Col
                            key={key}
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            className="m-0 dashboard_items stat-items"
                        >
                            <Link legacyBehavior href={value.link}>
                                <div className="card-body cursor-pointer text-decoration-none">
                                    <Row className="d-flex align-items-center">
                                        <Col lg={4} md={5} sm={4}>
                                            <Image src={value.icon} />
                                        </Col>
                                        <Col
                                            md={7}
                                            lg={8}
                                            sm={8}
                                            className="d-flex flex-column align-items-start justify-content-start"
                                        >
                                            <h5 className={`card-title  text-muted mb-0`}>
                                                {t(key)}
                                            </h5>
                                            <span className={`h2 font-weight-bold mb-0`}>
                                                {value.value}
                                            </span>
                                        </Col>
                                    </Row>
                                </div>
                            </Link>
                        </Col>
                    ))}
            </Row>

            <Row className=" my-2 d-flex align-items-start justify-content-start ">
                <Col xl={4} lg={4} md={4} sm={12} className="my-2 dashboard_items">
                    <div
                        className={`card-body`}
                        onClick={() => {
                            setShowBdaysList(true);
                        }}
                        style={{ cursor: "pointer" }}
                        onMouseLeave={() => setShowBdaysList(false)}
                    >
                        <Row className="d-flex align-items-center ">
                            <Col lg={4} md={5} sm={4}></Col>
                            <Col
                                md={7}
                                lg={8}
                                sm={8}
                                className="d-flex flex-column align-items-start justify-content-start "
                            >
                                <h5 className={`card-title  text-muted mb-0`}>
                                    {t("EMPLOYEE_BIRTHDAYS")}
                                </h5>
                                <span className={`h2 font-weight-bold mb-0`}>
                                    {data.EMPLOYEE_BIRTHDAYS?.value}
                                </span>
                            </Col>
                        </Row>
                        {showBdaysList && (
                            <div className={`dashboard_bday_box`}>
                                {birthdayDetails.length > 0 ? (
                                    birthdayDetails?.map((employee, index) => (
                                        <span key={index} className="text-secondary">
                                            {employee.first_name} {employee.last_name} --{" "}
                                            {moment(new Date(employee.birthdate)).format("MM/DD")}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-secondary">
                                        {t("NO_BIRTHDAYS_THIS_WEEK")}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </Col>
                <Col xl={4} lg={4} md={4} sm={12} className="my-2 dashboard_items">
                    <div className={`card-body`} style={{ cursor: "pointer" }}>
                        <Row className="d-flex align-items-center ">
                            <Col lg={4} md={5} sm={4}></Col>
                            <Link legacyBehavior href={data.ACTIVE_JOB_POSTS?.link}>
                                <Col
                                    md={7}
                                    lg={8}
                                    sm={8}
                                    className=" d-flex flex-column align-items-start justify-content-start"
                                >
                                    <h5 className={`card-title  text-muted mb-0`}>
                                        {t("ACTIVE_JOB_POSTS")}
                                    </h5>
                                    <span className={`h2 font-weight-bold mb-0`}>
                                        {data.ACTIVE_JOB_POSTS?.value}
                                    </span>
                                </Col>
                            </Link>
                        </Row>
                    </div>
                </Col>
                <Col xl={4} lg={4} md={4} sm={12} className="my-2 dashboard_items">
                    <div className={`card-body`} style={{ cursor: "pointer" }}>
                        <Row className="d-flex align-items-center ">
                            <Col lg={4} md={5} sm={4}></Col>
                            <Col
                                md={7}
                                lg={8}
                                sm={8}
                                className="d-flex flex-column align-items-start justify-content-start "
                            >
                                <h5 className={`card-title  text-muted mb-0`}>
                                    {t("CONVERSION_RATE")}
                                </h5>
                                <span className={`h2 font-weight-bold mb-0`}>
                                    {data.CONVERSION_RATE?.text}
                                </span>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    );
};
