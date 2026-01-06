import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import { useTranslation } from '../../hooks/use-translation';
import { format } from 'date-fns';
import { MVR_RECORD_PRICE } from '../../config/billing/plans.config';

export interface MVRRecord {
  id: string;
  driver_name: string;
  license_number: string;
  pulled_date: Date | string;
  price: number;
  status: 'completed' | 'pending' | 'failed';
}

interface MVRRecordHistoryProps {
  records: MVRRecord[];
  loading?: boolean;
}

export function MVRRecordHistory({
  records,
  loading,
}: MVRRecordHistoryProps) {
  const { t } = useTranslation();

  const totalCost = records
    .filter((r) => r.status === 'completed')
    .reduce((sum, record) => sum + (record.price || MVR_RECORD_PRICE), 0);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      completed: 'success',
      pending: 'warning',
      failed: 'danger',
    };
    return (
      <Badge bg={variants[status] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0">MVR Record Pulling</h5>
          <p className="text-muted mb-0 small">
            Historical records from last month
          </p>
        </div>
        <div className="text-end">
          <div className="text-muted small">Total</div>
          <h4 className="mb-0">${totalCost.toFixed(2)}</h4>
        </div>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted mb-0">
              No MVR records were pulled last month
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3 p-3 bg-light rounded">
              <p className="mb-1">
                <strong>Pricing:</strong> ${MVR_RECORD_PRICE} per record
              </p>
              <p className="mb-0 text-muted small">
                MVR (Motor Vehicle Record) checks are charged as they are
                pulled. Records pulled this month will appear on next month's
                invoice.
              </p>
            </div>

            <Table responsive hover>
              <thead>
                <tr>
                  <th>Driver Name</th>
                  <th>License Number</th>
                  <th>Date Pulled</th>
                  <th>Status</th>
                  <th className="text-end">Cost</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.driver_name}</td>
                    <td>
                      <code>{record.license_number}</code>
                    </td>
                    <td>
                      {format(
                        new Date(record.pulled_date),
                        'MMM dd, yyyy h:mm a'
                      )}
                    </td>
                    <td>{getStatusBadge(record.status)}</td>
                    <td className="text-end">
                      {record.status === 'completed' ? (
                        <strong>
                          ${(record.price || MVR_RECORD_PRICE).toFixed(2)}
                        </strong>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="table-active">
                  <td colSpan={4} className="text-end">
                    <strong>Total:</strong>
                  </td>
                  <td className="text-end">
                    <strong>${totalCost.toFixed(2)}</strong>
                  </td>
                </tr>
              </tfoot>
            </Table>
          </>
        )}
      </Card.Body>
    </Card>
  );
}
