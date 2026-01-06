import React, { useState } from 'react';
import { Card, Button, ListGroup, Badge, Modal } from 'react-bootstrap';
import { useTranslation } from '../../hooks/use-translation';
import { PaymentMethodEntity } from '../../models/billing/payment-method.entity';
import { CreditCard, Trash, Star } from 'react-bootstrap-icons';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '../../utils/stripe';
import { AddPaymentMethodForm } from './AddPaymentMethodForm';

interface PaymentMethodsManagerProps {
  paymentMethods: PaymentMethodEntity[];
  onAdd: (paymentMethodId: string) => Promise<void>;
  onSetDefault: (paymentMethodId: string) => Promise<void>;
  onRemove: (paymentMethodId: string) => Promise<void>;
  loading?: boolean;
}

export function PaymentMethodsManager({
  paymentMethods,
  onAdd,
  onSetDefault,
  onRemove,
  loading,
}: PaymentMethodsManagerProps) {
  const { t } = useTranslation();
  const [showAddModal, setShowAddModal] = useState(false);

  const getBrandIcon = (brand: string) => {
    // You could import actual card brand SVGs here
    return <CreditCard size={20} />;
  };

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{t('PAYMENT_METHODS')}</h5>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
          >
            + {t('ADD_PAYMENT_METHOD')}
          </Button>
        </Card.Header>
        <Card.Body>
          {paymentMethods.length === 0 ? (
            <p className="text-muted text-center py-4">
              {t('NO_PAYMENT_METHODS_ADDED')}
            </p>
          ) : (
            <ListGroup variant="flush">
              {paymentMethods.map((pm) => (
                <ListGroup.Item
                  key={pm.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    {getBrandIcon(pm.brand || '')}
                    <div className="ms-3">
                      <div>
                        <strong>{pm.brand?.toUpperCase()}</strong> ···· {pm.last4}
                        {pm.is_default && (
                          <Badge bg="primary" className="ms-2">
                            {t('DEFAULT')}
                          </Badge>
                        )}
                      </div>
                      <small className="text-muted">
                        {t('EXPIRES')} {pm.exp_month}/{pm.exp_year}
                      </small>
                    </div>
                  </div>

                  <div>
                    {!pm.is_default && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => onSetDefault(pm.id!)}
                        disabled={loading}
                        title={t('SET_AS_DEFAULT')}
                      >
                        <Star />
                      </Button>
                    )}
                    <Button
                      variant="link"
                      size="sm"
                      className="text-danger"
                      onClick={() => onRemove(pm.id!)}
                      disabled={loading || pm.is_default}
                      title={t('REMOVE')}
                    >
                      <Trash />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('ADD_PAYMENT_METHOD')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Elements stripe={getStripe()}>
            <AddPaymentMethodForm
              onSuccess={(paymentMethodId) => {
                onAdd(paymentMethodId).then(() => setShowAddModal(false));
              }}
              onCancel={() => setShowAddModal(false)}
            />
          </Elements>
        </Modal.Body>
      </Modal>
    </>
  );
}
