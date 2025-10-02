import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useMemo } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { People, BriefcaseFill, PersonFill, PersonPlus, Search } from 'react-bootstrap-icons';

import DashboardChartContext from '../../context/dashboard-chart-context';
import { EmployeeStatus } from '../../enums/applicants/employee-status.enum';
import { useTranslation } from '../../hooks/use-translation';
import { EmployeeEntity } from '../../models/employee/employee.entity';
import { isBirthdayThisWeek } from '../../utils/date';

import styles from './dashboard-stats.module.css';

type StatCard = {
  title: string;
  value: string | number;
  icon?: any;
  link: string;
  linkText?: string;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  isMainCard?: boolean; // Determines if it's a main stat card or plain text stat
};

export const DashboardStats = () => {
  const { state } = useContext(DashboardChartContext);
  const { t } = useTranslation();

  const calculateStats = () => {
    const applicants = state?.applicants || [];
    const employees = state?.employees || [];
    const jobs = state?.jobs || [];
    const today = new Date();
    const currentWeek = moment().isoWeek();
    const currentYear = moment().year();

    let newLeads = 0;
    let totalLeads = 0;
    let birthdaysThisWeek = 0;
    let birthdayEmployees: EmployeeEntity[] = [];

    // DRIV-144 - Use all applicants without deduplication
    const uniqueApplicants = applicants;

    // Calculate applicant stats using all applicants
    uniqueApplicants.forEach((a) => {
      // All applicants should be counted as leads regardless of status
      // The type field determines how they came into the system
      const isLead = true; // Count all applicants as leads

      // Improved week calculation - check both week and year
      let isThisWeek = false;
      if (a?.created_at) {
        const createdMoment = moment(a.created_at);
        const createdWeek = createdMoment.isoWeek();
        const createdYear = createdMoment.year();
        isThisWeek = createdWeek === currentWeek && createdYear === currentYear;
      }

      // Count all applicants as leads
      if (isLead) {
        totalLeads++;
        if (isThisWeek) {
          newLeads++;
        }
      }
    });

    // Calculate employee birthdays
    employees.forEach((employee) => {
      const birthdate = new Date(employee.birthdate);
      if (isBirthdayThisWeek(birthdate)) {
        birthdaysThisWeek++;
        birthdayEmployees.push(employee);
      }
    });

    // Calculate conversion rate: hired applicants / total leads (not total applicants)
    // const hiredApplicants = uniqueApplicants.filter((a) => Boolean(a?.is_hired));
    // const conversionRate = totalLeads > 0
    //   ? (
    //       (hiredApplicants.filter(a => a.current_application_status?.startsWith('NEW_')).length / totalLeads) *
    //       100
    //     ).toFixed(1)
    //   : 0;

    // Calculate conversion rate: active employees / total leads
    const activeEmployees = employees.filter((v) => v?.status === EmployeeStatus.ACTIVE).length;
    const conversionRate = totalLeads > 0 ? ((activeEmployees / totalLeads) * 100).toFixed(1) : 0;

    const stats: StatCard[] = [
      // Main stat cards (3 columns)
      {
        title: 'New Applicants This Week',
        value: newLeads,
        icon: (
          <div className={styles.icon_circle} style={{ backgroundColor: '#FED100' }}>
            <PersonPlus size={38} className="text-white" />
          </div>
        ),
        link: '/dashboard/company/applicants',
        linkText: 'Go to Applicants',
        isMainCard: true,
      },
      {
        title: 'Total Hires This Month',
        value: activeEmployees,
        icon: (
          <div className={styles.icon_circle} style={{ backgroundColor: '#B4FD55' }}>
            <Search size={38} className="text-white" />
          </div>
        ),
        link: '/dashboard/company/compliance/employee-directory',
        linkText: 'Go to Applicants',
        isMainCard: true,
      },
      {
        title: 'Total Employees',
        value: employees.filter((v) => v?.status === EmployeeStatus.ACTIVE).length,
        icon: (
          <div className={styles.icon_circle} style={{ backgroundColor: '#5fcbc4' }}>
            <People size={38} className="text-white" />
          </div>
        ),
        link: '/dashboard/company/compliance/employee-directory',
        linkText: 'Go to Employees',
        isMainCard: true,
      },
      // Plain text stats (no cards)
      {
        title: 'Conversion Rate (Lead To Hire)',
        value: `${conversionRate}%`,
        link: '/dashboard/company/applicants',
        isMainCard: false,
      },
      {
        title: 'Active Job Posts',
        value: jobs.length,
        link: '/dashboard/company/jobs',
        isMainCard: false,
      },
      {
        title: 'Employee Birthdays This Week',
        value: birthdaysThisWeek,
        link: '/dashboard/company/compliance/employee-directory',
        isMainCard: false,
      },
    ];

    return stats;
  };

  const stats = useMemo(() => calculateStats(), [state]);
  const mainCards = stats.filter((stat) => stat.isMainCard);
  const plainStats = stats.filter((stat) => !stat.isMainCard);

  return (
    <div className={styles.dashboard_stats}>
      {/* Main stat cards - 3 columns */}
      <Row className="mb-4">
        {mainCards.map((stat, index) => (
          <Col md={4} key={index} className="mb-3">
            <Link href={stat.link}>
              <Card className={`${styles.stat_card} h-100`} style={{ cursor: 'pointer' }}>
                <CardBody className="p-4 position-relative">
                  <div className="d-flex align-items-center">
                    <div className="me-3">{stat.icon}</div>
                    <div className="flex-grow-1">
                      <div className={`${styles.stat_title} text-muted mb-2`}>{stat.title}</div>
                      <div className={`${styles.stat_value} display-4 fw-bold`}>{stat.value}</div>
                    </div>
                  </div>
                  {stat.linkText && (
                    <div className="position-absolute bottom-0 end-0 p-3">
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                        {stat.linkText} →
                      </small>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {/* Plain stats - 3 columns, no cards */}
      <Row className="mb-4">
        {plainStats.map((stat, index) => (
          <Col md={4} key={index} className="mb-3">
            <Link href={stat.link}>
              <div className={styles.plain_stat} style={{ cursor: 'pointer' }}>
                <div className={`${styles.plain_stat_title} text-muted small`}>{stat.title}</div>
                <div className={`${styles.plain_stat_value} h2 fw-bold text-dark`}>
                  {stat.value}
                </div>
              </div>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};
