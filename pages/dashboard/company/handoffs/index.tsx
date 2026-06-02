import React, { useEffect, useState, useCallback } from 'react';
import { Container, Card, CardBody, Alert } from 'reactstrap';

import FullLayout from '../../../../components/dashboard/layouts/layout/full-layout';
import PageLayout from '../../../../components/layouts/page/page-layout';
import { HandoffInboxTable } from '../../../../components/campaigns';
import { useHandoffInbox } from '../../../../hooks/campaigns/use-handoffs';
import { useFeatureFlags } from '../../../../context/feature-flag-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { CampaignHandoffStatus } from '../../../../enums/campaigns/campaign-handoff-status.enum';

type StatusFilter = 'all' | CampaignHandoffStatus;

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: CampaignHandoffStatus.PENDING, label: 'Pending' },
  { value: CampaignHandoffStatus.ACCEPTED, label: 'In Progress' },
  { value: CampaignHandoffStatus.COMPLETED, label: 'Completed' },
  { value: CampaignHandoffStatus.DISMISSED, label: 'Dismissed' },
];

const HandoffsPage = () => {
  const { t } = useTranslation();
  const { isFeatureEnabled, isLoading: flagsLoading } = useFeatureFlags();
  const { handoffs, stats, loading, error, load, accept, complete, dismiss } = useHandoffInbox();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [actioningIds, setActioningIds] = useState<Set<number>>(new Set());

  const campaignsEnabled = !flagsLoading && isFeatureEnabled('CAMPAIGNS_ENABLED');

  useEffect(() => {
    if (!campaignsEnabled) return;
    load(statusFilter === 'all' ? undefined : { status: statusFilter });
  }, [campaignsEnabled, statusFilter, load]);

  const withAction = useCallback(
    async (id: number, fn: (id: number) => Promise<unknown>) => {
      setActioningIds((prev) => new Set(prev).add(id));
      try {
        await fn(id);
        // Refresh to reflect the filtered list / stats
        await load(statusFilter === 'all' ? undefined : { status: statusFilter });
      } catch (err) {
        console.error('Handoff action failed:', err);
      } finally {
        setActioningIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [load, statusFilter]
  );

  const countFor = (value: StatusFilter) => {
    if (!stats) return undefined;
    if (value === 'all') {
      return Object.values(stats).reduce((sum, n) => sum + (n || 0), 0);
    }
    return stats[value];
  };

  if (flagsLoading) {
    return (
      <Container>
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="sr-only">{t('LOADING')}</span>
          </div>
        </div>
      </Container>
    );
  }

  if (!campaignsEnabled) {
    return (
      <PageLayout title="HANDOFFS">
        <Container>
          <Alert color="warning">{t('CAMPAIGNS_NOT_AVAILABLE')}</Alert>
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="HANDOFFS">
      <Container fluid>
        {/* Status filter pills */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '4px',
              backgroundColor: 'var(--form-info-bg, #f8f9fa)',
              borderRadius: '12px',
              border: '1px solid var(--medium-gray, #dee2e6)',
              flexWrap: 'wrap',
            }}
          >
            {FILTERS.map((filter) => {
              const isActive = statusFilter === filter.value;
              const count = countFor(filter.value);
              return (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  style={{
                    padding: '0.625rem 1.25rem',
                    fontSize: '1rem',
                    backgroundColor: isActive ? 'var(--primary-dark, #006078)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    color: isActive ? '#fff' : 'var(--text-secondary, #6c757d)',
                  }}
                >
                  {filter.label}
                  {count != null && <span className="ms-2 opacity-75">({count})</span>}
                </button>
              );
            })}
          </div>
        </div>

        {error && <Alert color="danger">{error}</Alert>}

        <Card className="shadow-sm">
          <CardBody className="p-3">
            {loading && handoffs.length === 0 ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="sr-only">{t('LOADING')}</span>
                </div>
              </div>
            ) : (
              <HandoffInboxTable
                handoffs={handoffs}
                loading={loading}
                actioningIds={actioningIds}
                onAccept={(id) => withAction(id, accept)}
                onComplete={(id) => withAction(id, complete)}
                onDismiss={(id) => withAction(id, dismiss)}
              />
            )}
          </CardBody>
        </Card>
      </Container>
    </PageLayout>
  );
};

HandoffsPage.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

export default HandoffsPage;
