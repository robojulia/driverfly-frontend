import React from 'react';
import { Card, Table, Button, Badge } from 'react-bootstrap';
import { useTranslation } from '../../hooks/use-translation';
import { InvoiceEntity } from '../../models/billing/invoice.entity';
import { format } from 'date-fns';
import { Download, Eye } from 'react-bootstrap-icons';

interface InvoiceListProps {
  invoices: InvoiceEntity[];
  onDownload: (invoiceId: string) => void;
  onView: (invoiceId: string) => void;
  loading?: boolean;
}

export function InvoiceList({
  invoices,
  onDownload,
  onView,
  loading,
}: InvoiceListProps) {
  const { t } = useTranslation();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      paid: 'success',
      open: 'warning',
      void: 'secondary',
      uncollectible: 'danger',
      draft: 'info',
    };
    return (
      <Badge bg={variants[status] || 'secondary'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const formatAmount = (amount: number, currency: string = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Stripe amounts are in cents
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">{t('INVOICE_HISTORY')}</h5>
      </Card.Header>
      <Card.Body>
        {invoices.length === 0 ? (
          <p className="text-muted text-center py-4">
            {t('NO_INVOICES_FOUND')}
          </p>
        ) : (
          <Table responsive hover>
            <thead>
              <tr>
                <th>{t('INVOICE_NUMBER')}</th>
                <th>{t('DATE')}</th>
                <th>{t('AMOUNT')}</th>
                <th>{t('STATUS')}</th>
                <th>{t('ACTIONS')}</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    <strong>{invoice.invoice_number || invoice.id}</strong>
                  </td>
                  <td>
                    {invoice.created &&
                      format(new Date(invoice.created), 'MMM dd, yyyy')}
                  </td>
                  <td>
                    {formatAmount(
                      invoice.amount_paid || invoice.amount_due || 0,
                      invoice.currency
                    )}
                  </td>
                  <td>{getStatusBadge(invoice.status || 'draft')}</td>
                  <td>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => onView(invoice.id!)}
                      disabled={loading}
                      title={t('VIEW_INVOICE')}
                    >
                      <Eye />
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => onDownload(invoice.id!)}
                      disabled={loading || !invoice.invoice_pdf}
                      title={t('DOWNLOAD_PDF')}
                    >
                      <Download />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}
