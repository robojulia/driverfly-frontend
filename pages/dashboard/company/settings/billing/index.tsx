import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import FullLayout from '../../../../../components/dashboard/layouts/layout/full-layout';
import PageLayout from '../../../../../components/layouts/page/page-layout';
import { TabbedLayout } from '../../../../../components/layouts/page/tabbed-layout';
import { useAuth } from '../../../../../hooks/use-auth';
import { useTranslation } from '../../../../../hooks/use-translation';
import { useEffectAsync } from '../../../../../utils/react';
import { globalAjaxExceptionHandler } from '../../../../../utils/ajax';
import BillingApi from '../../../../api/billing';
import { SubscriptionEntity } from '../../../../../models/billing/subscription.entity';
import { PaymentMethodEntity } from '../../../../../models/billing/payment-method.entity';
import { InvoiceEntity } from '../../../../../models/billing/invoice.entity';
import { UsageMetricsEntity } from '../../../../../models/billing/usage-metrics.entity';
import { BaseSubscriptionDisplay } from '../../../../../components/billing/BaseSubscriptionDisplay';
import { PaymentMethodsManager } from '../../../../../components/billing/PaymentMethodsManager';
import { InvoiceList } from '../../../../../components/billing/InvoiceList';
import { AutoRecruitingAddon } from '../../../../../components/billing/AutoRecruitingAddon';
import { AIAgentCampaigns } from '../../../../../components/billing/AIAgentCampaigns';
import { MVRToggle } from '../../../../../components/billing/MVRToggle';
import { BillingInterval } from '../../../../../enums/billing/subscription-plan.enum';

export default function BillingPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, hasPermission } = useAuth();

  const [subscription, setSubscription] = useState<SubscriptionEntity | null>(
    null
  );
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodEntity[]>(
    []
  );
  const [invoices, setInvoices] = useState<InvoiceEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [billingInterval, setBillingInterval] = useState<BillingInterval>(
    BillingInterval.MONTHLY
  );
  const [employeeCount, setEmployeeCount] = useState<number>(0);
  const [driverSeats, setDriverSeats] = useState<number>(0);
  const [users, setUsers] = useState<
    Array<{
      id: number;
      name: string;
      email: string;
      role: string;
      isDriver: boolean;
    }>
  >([]);

  // Add-on features state
  const [autoRecruitingEnabled, setAutoRecruitingEnabled] = useState(false);
  const [aiAgentPlan, setAiAgentPlan] = useState<'STARTER' | 'STANDARD' | 'ENTERPRISE' | null>(null);
  const [mvrEnabled, setMvrEnabled] = useState(false);

  useEffectAsync(async () => {
    await loadBillingData();
  }, []);

  // Permission check - same as other company settings pages
  if (!hasPermission('CanViewCompany')) {
    router.push('/dashboard/company');
    return null;
  }

  const loadBillingData = async () => {
    setLoading(true);
    try {
      const api = new BillingApi();

      const [subData, pmData, invData] = await Promise.all([
        api.subscription.get().catch(() => null), // Subscription might not exist yet
        api.paymentMethods.list().catch(() => []),
        api.invoices.list({ limit: 12 }).catch(() => []),
      ]);

      setSubscription(subData);
      setPaymentMethods(pmData);
      setInvoices(invData);

      // Set states from subscription data if available
      if (subData) {
        setBillingInterval(
          subData.billing_interval || BillingInterval.MONTHLY
        );
        setAutoRecruitingEnabled(subData.auto_recruiting_enabled || false);
        setAiAgentPlan(subData.ai_agent_plan || null);
        setMvrEnabled(subData.mvr_enabled || false);
        setEmployeeCount(subData.employee_count || 0);
        setDriverSeats(subData.driver_seats || 0);
      }

      // Load company users for seat allocation
      // TODO: Replace with actual API call when backend is ready
      // const userApi = new UserApi();
      // const userData = await userApi.list().catch(() => []);
      // setUsers(userData.map(u => ({
      //   id: u.id,
      //   name: u.name,
      //   email: u.email,
      //   role: u.role,
      //   isDriver: u.is_driver || false
      // })));

      // Mock data for now
      setUsers([]);
    } catch (error) {
      globalAjaxExceptionHandler(error, { t, toast });
    } finally {
      setLoading(false);
    }
  };

  const handleBillingIntervalChange = async (interval: BillingInterval) => {
    setBillingInterval(interval);
    try {
      const api = new BillingApi();

      if (subscription) {
        // Update existing subscription
        const updatedSub = await api.subscription.update({
          billing_interval: interval,
        });
        setSubscription(updatedSub);
        toast.success(t('SUBSCRIPTION_UPDATED_SUCCESSFULLY'));
        await loadBillingData(); // Refresh all data
      } else {
        // No subscription yet, just update local state
        toast.info('Billing interval updated. Subscribe to a plan to apply.');
      }
    } catch (error) {
      globalAjaxExceptionHandler(error, { t, toast });
      // Revert on error
      setBillingInterval(
        subscription?.billing_interval || BillingInterval.MONTHLY
      );
    }
  };

  const handleAddPaymentMethod = async (paymentMethodId: string) => {
    try {
      const api = new BillingApi();
      await api.paymentMethods.attach(paymentMethodId);
      toast.success(t('PAYMENT_METHOD_ADDED_SUCCESSFULLY'));
      await loadBillingData();
    } catch (error) {
      globalAjaxExceptionHandler(error, { t, toast });
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      const api = new BillingApi();
      await api.paymentMethods.setDefault(paymentMethodId);
      toast.success(t('DEFAULT_PAYMENT_METHOD_UPDATED'));
      await loadBillingData();
    } catch (error) {
      globalAjaxExceptionHandler(error, { t, toast });
    }
  };

  const handleRemovePaymentMethod = async (paymentMethodId: string) => {
    if (!confirm(t('CONFIRM_REMOVE_PAYMENT_METHOD'))) return;

    try {
      const api = new BillingApi();
      await api.paymentMethods.remove(paymentMethodId);
      toast.success(t('PAYMENT_METHOD_REMOVED_SUCCESSFULLY'));
      await loadBillingData();
    } catch (error) {
      globalAjaxExceptionHandler(error, { t, toast });
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const api = new BillingApi();
      const blob = await api.invoices.downloadPdf(invoiceId);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(t('INVOICE_DOWNLOADED'));
    } catch (error) {
      globalAjaxExceptionHandler(error, { t, toast });
    }
  };

  const handleViewInvoice = async (invoiceId: string) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (invoice?.hosted_invoice_url) {
      window.open(invoice.hosted_invoice_url, '_blank');
    }
  };

  const handleToggleAutoRecruiting = async (enabled: boolean) => {
    try {
      const api = new BillingApi();
      // TODO: Add auto recruiting endpoint when backend is ready
      // await api.addons.updateAutoRecruiting({ enabled });
      setAutoRecruitingEnabled(enabled);
      toast.success(
        enabled
          ? t('AUTO_RECRUITING_ENABLED')
          : t('AUTO_RECRUITING_DISABLED')
      );
      await loadBillingData();
    } catch (error) {
      globalAjaxExceptionHandler(error, { t, toast });
    }
  };

  const handleSelectAiAgentPlan = async (
    plan: 'STARTER' | 'STANDARD' | 'ENTERPRISE' | null
  ) => {
    try {
      const api = new BillingApi();
      // TODO: Add AI agent plan endpoint when backend is ready
      // await api.addons.updateAiAgentPlan({ plan });
      setAiAgentPlan(plan);
      toast.success(
        plan ? t('AI_AGENT_PLAN_UPDATED') : t('AI_AGENT_PLAN_DISABLED')
      );
      await loadBillingData();
    } catch (error) {
      globalAjaxExceptionHandler(error, { t, toast });
    }
  };

  const handleToggleMvr = async (enabled: boolean) => {
    try {
      const api = new BillingApi();
      // TODO: Add MVR toggle endpoint when backend is ready
      // await api.addons.updateMvr({ enabled });
      setMvrEnabled(enabled);
      toast.success(
        enabled ? t('MVR_ENABLED') : t('MVR_DISABLED')
      );
      await loadBillingData();
    } catch (error) {
      globalAjaxExceptionHandler(error, { t, toast });
    }
  };

  const tabs = {
    'Overview': (
      <>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">{t('LOADING')}</p>
          </div>
        ) : (
          <>
            <BaseSubscriptionDisplay
              billingInterval={billingInterval}
              onIntervalChange={handleBillingIntervalChange}
              employeeCount={employeeCount}
              driverSeats={driverSeats}
              users={users}
            />

            <h4 className="mt-4 mb-3">Add-on Services</h4>

            <AutoRecruitingAddon
              enabled={autoRecruitingEnabled}
              onToggle={handleToggleAutoRecruiting}
              loading={loading}
            />

            <AIAgentCampaigns
              currentPlan={aiAgentPlan}
              billingInterval={billingInterval}
              onSelectPlan={handleSelectAiAgentPlan}
              loading={loading}
            />

            <MVRToggle
              enabled={mvrEnabled}
              onToggle={handleToggleMvr}
              loading={loading}
            />
          </>
        )}
      </>
    ),
    'Payment Methods': (
      <div>
        {loading && paymentMethods.length === 0 ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">{t('LOADING')}</p>
          </div>
        ) : (
          <PaymentMethodsManager
            paymentMethods={paymentMethods}
            onAdd={handleAddPaymentMethod}
            onSetDefault={handleSetDefaultPaymentMethod}
            onRemove={handleRemovePaymentMethod}
            loading={loading}
          />
        )}
      </div>
    ),
    'Invoices': (
      <div>
        {loading && invoices.length === 0 ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">{t('LOADING')}</p>
          </div>
        ) : (
          <InvoiceList
            invoices={invoices}
            onDownload={handleDownloadInvoice}
            onView={handleViewInvoice}
            loading={loading}
          />
        )}
      </div>
    ),
  };

  return (
    <PageLayout title="BILLING" desciption="BILLING_DESCRIPTION">
      <TabbedLayout items={tabs} />
    </PageLayout>
  );
}

BillingPage.getLayout = function getLayout(page: React.ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};
