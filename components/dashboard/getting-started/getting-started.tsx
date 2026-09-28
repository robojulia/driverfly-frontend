import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, ProgressBar } from 'react-bootstrap';
import {
  Briefcase,
  Building,
  CheckCircleFill,
  ChevronRight,
  Circle,
  PersonCircle,
  PersonPlus,
  People,
  Search,
  Sliders,
} from 'react-bootstrap-icons';
import { Icon } from 'react-bootstrap-icons';
import { useAuth } from '../../../hooks/use-auth';
import { useOnboarding } from '../../../hooks/use-onboarding';
import { useTranslation } from '../../../hooks/use-translation';
import CompanyApi from '../../../pages/api/company';
import EmployeeApi from '../../../pages/api/employee';
import JobApi from '../../../pages/api/job';
import UserApi from '../../../pages/api/user';
import { useEffectAsync } from '../../../utils/react';
import styles from './getting-started.module.css';
import { WelcomeTourModal } from './welcome-tour-modal';

// Opening /dashboard/company?getting_started=1 brings the checklist and tour back.
export const GETTING_STARTED_QUERY = 'getting_started';

type ChecklistTask = {
  key: string;
  icon: Icon;
  href: string;
  done: boolean;
};

type ChecklistData = {
  companyProfileComplete: boolean;
  jobCount: number;
  employeeCount: number;
  userCount: number;
};

function countOf(result: unknown): number {
  if (Array.isArray(result)) return result.length;
  const page = result as { items?: unknown[]; meta?: { totalItems?: number } };
  return page?.meta?.totalItems ?? page?.items?.length ?? 0;
}

export function GettingStarted() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, company, hasPermission, isCompanyAdministrator, isImpersonating, isSuperAdmin } =
    useAuth();
  const { loaded, state, isNewAccount, save, markVisited } = useOnboarding();
  const [showTour, setShowTour] = useState(false);
  const [data, setData] = useState<ChecklistData>(null);

  const reopenRequested = router.query[GETTING_STARTED_QUERY] !== undefined;
  const checklistVisible = loaded && (state.showChecklist ?? isNewAccount);

  // Greet a newly created account the first time it signs in.
  useEffect(() => {
    if (!loaded || state.welcomeSeen) return;
    if (isNewAccount && !isImpersonating && !isSuperAdmin) setShowTour(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  // "Getting started" from the profile menu.
  useEffect(() => {
    if (!loaded || !reopenRequested) return;
    save({ showChecklist: true });
    setShowTour(true);
    const { [GETTING_STARTED_QUERY]: _, ...query } = router.query;
    router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, reopenRequested]);

  const canCreateJob = hasPermission('CanCreateJob');
  const canInviteUsers = isCompanyAdministrator && hasPermission('CanCreateUser');

  useEffectAsync(async () => {
    if (!checklistVisible || !company?.id) return;

    const [profile, jobs, employees, users] = await Promise.all([
      isCompanyAdministrator ? new CompanyApi().me.get().catch(() => null) : null,
      canCreateJob
        ? new JobApi()
            .list({ companyId: company.id, is_paginated: true, limit: 1 })
            .catch(() => null)
        : null,
      isCompanyAdministrator
        ? new EmployeeApi().list({ is_paginated: true, limit: 1 }).catch(() => null)
        : null,
      canInviteUsers ? new UserApi().list(company.id).catch(() => null) : null,
    ]);

    setData({
      companyProfileComplete: !!(profile?.about && profile?.photo),
      jobCount: countOf(jobs),
      employeeCount: countOf(employees),
      userCount: countOf(users),
    });
  }, [checklistVisible, company?.id]);

  const visited = (key: string) => (state.visited || []).includes(key);

  const tasks: ChecklistTask[] = [];
  if (isCompanyAdministrator) {
    tasks.push({
      key: 'COMPANY_PROFILE',
      icon: Building,
      href: '/dashboard/company/settings',
      done: !!data?.companyProfileComplete,
    });
  }
  if (canCreateJob) {
    tasks.push({
      key: 'FIRST_JOB',
      icon: Briefcase,
      href: '/dashboard/company/jobs/create',
      done: (data?.jobCount ?? 0) > 0,
    });
  }
  if (isCompanyAdministrator) {
    tasks.push({
      key: 'RECRUITING_PREFERENCES',
      icon: Sliders,
      href: '/dashboard/company/company-preferences',
      done: visited('RECRUITING_PREFERENCES'),
    });
  }
  if (canInviteUsers) {
    tasks.push({
      key: 'INVITE_TEAM',
      icon: PersonPlus,
      href: '/dashboard/company/settings/users',
      done: (data?.userCount ?? 0) > 1,
    });
  }
  if (isCompanyAdministrator) {
    tasks.push({
      key: 'ADD_EMPLOYEES',
      icon: People,
      href: '/dashboard/company/compliance/employee-directory',
      done: (data?.employeeCount ?? 0) > 0,
    });
  }
  if (!isCompanyAdministrator && hasPermission('CanViewApplicant')) {
    tasks.push({
      key: 'EXPLORE_APPLICANTS',
      icon: Search,
      href: '/dashboard/company/applicants',
      done: visited('EXPLORE_APPLICANTS'),
    });
  }
  tasks.push({
    key: 'MY_PROFILE',
    icon: PersonCircle,
    href: '/dashboard/company/settings/profile',
    done: visited('MY_PROFILE'),
  });

  const completed = tasks.filter((task) => task.done).length;
  const allDone = completed === tasks.length;

  const closeTour = () => {
    setShowTour(false);
    if (!state.welcomeSeen) save({ welcomeSeen: true });
  };

  return (
    <>
      <WelcomeTourModal
        show={showTour}
        userName={user?.first_name}
        onClose={closeTour}
        onFinish={() => {
          closeTour();
          if (!checklistVisible) save({ showChecklist: true });
        }}
      />

      {checklistVisible && (
        <section className={styles.card} aria-labelledby="getting-started-title">
          <div className={styles.header}>
            <div>
              <h2 id="getting-started-title" className={styles.title}>
                {allDone ? t('GETTING_STARTED_ALL_DONE_TITLE') : t('GETTING_STARTED_TITLE')}
              </h2>
              <p className={styles.subtitle}>
                {allDone ? t('GETTING_STARTED_ALL_DONE_TEXT') : t('GETTING_STARTED_SUBTITLE')}
              </p>
            </div>
            <div className={styles.headerActions}>
              <Button variant="link" className={styles.linkBtn} onClick={() => setShowTour(true)}>
                {t('GETTING_STARTED_TAKE_TOUR')}
              </Button>
              <Button
                variant="link"
                className={styles.linkBtn}
                onClick={() => save({ showChecklist: false })}
                title={t('GETTING_STARTED_HIDE_HINT')}
              >
                {allDone ? t('CLOSE') : t('GETTING_STARTED_HIDE')}
              </Button>
            </div>
          </div>

          <div className={styles.progressRow}>
            <ProgressBar
              now={(completed / tasks.length) * 100}
              className={styles.progress}
              aria-label={t('GETTING_STARTED_PROGRESS', { done: completed, total: tasks.length })}
            />
            <span className={styles.progressText}>
              {t('GETTING_STARTED_PROGRESS', { done: completed, total: tasks.length })}
            </span>
          </div>

          <ul className={styles.tasks}>
            {tasks.map(({ key, icon: TaskIcon, href, done }) => (
              <li key={key}>
                <Link href={href}>
                  <a
                    className={`${styles.task} ${done ? styles.taskDone : ''}`}
                    onClick={() => markVisited(key)}
                  >
                    <span className={styles.status} aria-hidden="true">
                      {done ? <CheckCircleFill size={22} /> : <Circle size={22} />}
                    </span>
                    <span className={styles.taskIcon} aria-hidden="true">
                      <TaskIcon size={18} />
                    </span>
                    <span className={styles.taskText}>
                      <span className={styles.taskTitle}>
                        {t(`GETTING_STARTED_TASK_${key}`)}
                        {done && <span className="visually-hidden"> ({t('COMPLETED')})</span>}
                      </span>
                      <span className={styles.taskDescription}>
                        {t(`GETTING_STARTED_TASK_${key}_TEXT`)}
                      </span>
                    </span>
                    <ChevronRight className={styles.chevron} size={16} aria-hidden="true" />
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
