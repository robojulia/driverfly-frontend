import BaseApi from './_baseApi';
import { SubscriptionEntity } from '../../models/billing/subscription.entity';
import { PaymentMethodEntity } from '../../models/billing/payment-method.entity';
import { InvoiceEntity } from '../../models/billing/invoice.entity';
import { UsageMetricsEntity } from '../../models/billing/usage-metrics.entity';

export default class BillingApi extends BaseApi {
  baseUrl: string = 'billing';

  // Subscription Management
  subscription = {
    get: async (): Promise<SubscriptionEntity> => {
      const { data } = await this.get(`${this.baseUrl}/subscription`);
      return data;
    },
    create: async (dto: {
      plan: string;
      billing_interval: string;
      payment_method_id?: string;
    }): Promise<SubscriptionEntity> => {
      const { data } = await this.post(`${this.baseUrl}/subscription`, dto);
      return data;
    },
    update: async (dto: {
      plan?: string;
      billing_interval?: string;
    }): Promise<SubscriptionEntity> => {
      const { data } = await this.put(`${this.baseUrl}/subscription`, dto);
      return data;
    },
    cancel: async (
      cancelAtPeriodEnd: boolean = true
    ): Promise<SubscriptionEntity> => {
      const { data } = await this.post(`${this.baseUrl}/subscription/cancel`, {
        cancel_at_period_end: cancelAtPeriodEnd,
      });
      return data;
    },
    reactivate: async (): Promise<SubscriptionEntity> => {
      const { data } = await this.post(
        `${this.baseUrl}/subscription/reactivate`,
        {}
      );
      return data;
    },
  };

  // Payment Methods
  paymentMethods = {
    list: async (): Promise<PaymentMethodEntity[]> => {
      const { data } = await this.get(`${this.baseUrl}/payment-methods`);
      return data;
    },
    createSetupIntent: async (): Promise<{ client_secret: string }> => {
      const { data } = await this.post(
        `${this.baseUrl}/payment-methods/setup-intent`,
        {}
      );
      return data;
    },
    attach: async (paymentMethodId: string): Promise<PaymentMethodEntity> => {
      const { data } = await this.post(`${this.baseUrl}/payment-methods`, {
        payment_method_id: paymentMethodId,
      });
      return data;
    },
    setDefault: async (paymentMethodId: string): Promise<void> => {
      await this.put(
        `${this.baseUrl}/payment-methods/${paymentMethodId}/default`,
        {}
      );
    },
    remove: async (paymentMethodId: string): Promise<void> => {
      await this.delete(`${this.baseUrl}/payment-methods/${paymentMethodId}`);
    },
  };

  // Invoices
  invoices = {
    list: async (params?: {
      limit?: number;
      starting_after?: string;
    }): Promise<InvoiceEntity[]> => {
      const { data } = await this.get(
        this.buildUrl(`${this.baseUrl}/invoices`, params)
      );
      return data;
    },
    getById: async (invoiceId: string): Promise<InvoiceEntity> => {
      const { data } = await this.get(
        `${this.baseUrl}/invoices/${invoiceId}`
      );
      return data;
    },
    downloadPdf: async (invoiceId: string): Promise<Blob> => {
      const { data } = await this.get(
        `${this.baseUrl}/invoices/${invoiceId}/pdf`,
        {
          responseType: 'blob',
        }
      );
      return data;
    },
  };

  // Usage & Limits
  usage = {
    get: async (): Promise<UsageMetricsEntity> => {
      const { data } = await this.get(`${this.baseUrl}/usage`);
      return data;
    },
  };

  // Portal Session (for Stripe Customer Portal)
  createPortalSession = async (
    returnUrl: string
  ): Promise<{ url: string }> => {
    const { data } = await this.post(`${this.baseUrl}/portal-session`, {
      return_url: returnUrl,
    });
    return data;
  };
}
