import FullLayout from "../../../components/dashboard/layouts/FullLayout";
import { Col, Row, Card, CardBody, Table } from "reactstrap";
import useRedirect from '../../../hooks/useRedirect';
import { useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import JobList from "../../../public/dashboard/styles/css/JobList.module.css"
import Link from 'next/link';
import SavedJobApi from '../../api/saved-job';
import { useTranslation } from "../../../hooks/useTranslation";
import { CurrencyDollar } from 'react-bootstrap-icons';
import ShowEnumFromString from '../../../components/enum-filters/show-enum-from-string';
import { DriverLicenseType } from '../../../enums/users/driver-license-type.enum';
import ViewDataTable from '../../../components/viewDetails/viewDataTable';
import { buildAddress } from '../../../utils/common';
import OverlyPopover from '../../../components/popover/overly-popover';
import { JobDeliveryType } from '../../../enums/jobs/job-delivery-type.enum';
import useStorage from "../../../hooks/useStorage";

export default function JobsSaved() {

    const { authDriver } = useRedirect();
    authDriver()

    const { t } = useTranslation();
    const savedJobApi = new SavedJobApi();
    const { authCheck } = useAuth();
    const user = authCheck();
    const columnSettingKey = `driver.${user.id}.jobs-saved.columns`
    let settingsJson = useStorage().getItem(columnSettingKey)
    let settingsArray = settingsJson ? JSON.parse(settingsJson) : []

    const [savedJobs, setSavedJobs] = useState([])
    const [columnHistory, setColumnHistory] = useState([])

    const fetchJobs = async () => {
        await savedJobApi.list()
            .then(data => setSavedJobs(data))
            .catch((error) => {
                console.error(error)
            })
    }

    useEffect(async () => {
        fetchJobs()
        let columnArray = []
        await settingsArray.map(v => {
            columnArray[v.name] = v
        })
        setColumnHistory(columnArray)
    }, []);

    return (
        <div className={JobList.joblisting}>
            <Row className={JobList.link}>
                <Col sm="6" lg="8">
                    <h2 className='mt-3'>{t('SAVED_JOBS')}</h2>
                </Col>
            </Row>
            <Row className="mt-5">
                <Col lg="12 ">
                    <ViewDataTable
                        columns={[
                            {
                                name: "job_title",
                                selector: v =>
                                (
                                    <Link href={`/dashboard/driver/find-jobs/${v.job.id}`}>
                                        <a>
                                            <OverlyPopover skipTranslate={true} header={t('job_title')} str={v.job.title} />
                                        </a>
                                    </Link>
                                ),
                                hidable: false
                            },
                            {
                                name: "company",
                                selector: v => v.job.company?.name || null,
                                hide: (!!columnHistory.company?.hide),
                            },
                            {
                                name: "location",
                                selector: v =>
                                    (<OverlyPopover skipTranslate={true} header={t('location')} str={buildAddress(v.job.location || {})} />),
                                hide: (!!columnHistory.location?.hide),
                            },
                            {
                                name: "drivers_needed",
                                selector: v => v.job.drivers_needed,
                                hide: (!!columnHistory.drivers_needed?.hide),
                            },
                            {
                                name: "est_pay_per_week",
                                selector: v =>
                                    (<OverlyPopover skipTranslate={true} header={t('est_pay_per_week')} str={`${v.job.min_weekly_pay ? v.job.min_weekly_pay : 0} - ${v.job.max_weekly_pay ? v.job.max_weekly_pay : 0} ${t('per_week')}`} icon={< CurrencyDollar className='mr-1' />} />),
                                hide: (!!columnHistory.est_pay_per_week?.hide),
                            },
                            {
                                name: "LICENSE_TYPE",
                                selector: v =>
                                (<ShowEnumFromString
                                    popover_header={t('LICENSE_TYPE')}
                                    labelPrefix="DriverLicenseType"
                                    popover={true}
                                    str={v.job.cdl_class}
                                    enumArray={DriverLicenseType} />),
                                hide: (!!columnHistory.LICENSE_TYPE?.hide),
                            },
                            {
                                name: "DATE_SAVED",
                                selector: v =>
                                    v.created_at ?
                                        (<OverlyPopover skipTranslate={true} header={t('DATE_SAVED')} str={new Date(v.created_at).toDateString()} />)
                                        : null,
                                hide: (!!columnHistory.DATE_SAVED?.hide),
                            },
                            {
                                name: "expiration_date",
                                selector: v =>
                                    v.job.expiry_date ?
                                        (<OverlyPopover skipTranslate={true} header={t('expiration_date')} str={new Date(v.job.expiry_date).toDateString()} />)
                                        : null,
                                hide: (!!columnHistory.expiration_date?.hide),
                            },
                            {
                                name: "SCHEDULE",
                                selector: v =>
                                    (<OverlyPopover labelPrefix="JobSchedule" skipTranslate={false} header={t('SCHEDULE')} str={v.job.schedule} />),
                                hide: (!!columnHistory.SCHEDULE?.hide),
                            },
                            {
                                name: "EMPLOYMENT_TYPE",
                                selector: v =>
                                    (<OverlyPopover labelPrefix="JobEmploymentType" skipTranslate={false} header={t('EMPLOYMENT_TYPE')} str={v.job.employment_type} />),
                                hide: (!!columnHistory.EMPLOYMENT_TYPE?.hide),
                            },
                            {
                                name: "DELIVERY_TYPE",
                                selector: v =>
                                (<ShowEnumFromString
                                    popover_header={t('DELIVERY_TYPE')}
                                    labelPrefix="JobDeliveryType"
                                    popover={true}
                                    str={v.job.delivery_type}
                                    enumArray={JobDeliveryType} />
                                ),
                                hide: (!!columnHistory.DELIVERY_TYPE?.hide),
                            },
                            {
                                name: "TEAM_DRIVERS",
                                selector: v =>
                                    (<OverlyPopover labelPrefix="JobTeamDriver" skipTranslate={false} header={t('TEAM_DRIVERS')} str={v.job.team_drivers} />),
                                hide: (!!columnHistory.TEAM_DRIVERS?.hide),
                            },
                        ]}
                        items={savedJobs}
                        columnSettingKey={columnSettingKey}
                    />
                </Col>
            </Row>
        </div>
    )
}

JobsSaved.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
