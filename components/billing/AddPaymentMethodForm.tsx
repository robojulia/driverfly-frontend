import React, { useState } from 'react';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useTranslation } from '../../hooks/use-translation';
import BillingApi from '../../pages/api/billing';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

interface AddPaymentMethodFormProps {
  onSuccess: (paymentMethodId: string) => void;
  onCancel: () => void;
}

export function AddPaymentMethodForm({
  onSuccess,
  onCancel,
}: AddPaymentMethodFormProps) {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get SetupIntent from backend
      const api = new BillingApi();
      const { client_secret } = await api.paymentMethods.createSetupIntent();

      // Confirm card setup
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { setupIntent, error: stripeError } =
        await stripe.confirmCardSetup(client_secret, {
          payment_method: {
            card: cardElement,
          },
        });

      if (stripeError) {
        setError(stripeError.message || 'An error occurred');
        setLoading(false);
        return;
      }

      if (setupIntent?.payment_method) {
        onSuccess(setupIntent.payment_method as string);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add payment method');
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-4">
        <Form.Label>{t('CARD_INFORMATION')}</Form.Label>
        <div className="p-3 border rounded">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          {t('CANCEL')}
        </Button>
        <Button type="submit" variant="primary" disabled={!stripe || loading}>
          {loading && <Spinner animation="border" size="sm" className="me-2" />}
          {t('ADD_CARD')}
        </Button>
      </div>
    </Form>
  );
}
