export class InvoiceEntity {
  id?: string; // Stripe invoice ID
  invoice_number?: string;
  amount_due?: number; // in cents
  amount_paid?: number;
  currency?: string;
  status?: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  created?: Date | string;
  period_start?: Date | string;
  period_end?: Date | string;
  invoice_pdf?: string; // URL to PDF
  hosted_invoice_url?: string;
  lines?: {
    description?: string;
    amount?: number;
    quantity?: number;
  }[];
}
