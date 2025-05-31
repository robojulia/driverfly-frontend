import React from 'react';
import { useTranslation } from '../../../hooks/use-translation';

interface EquipmentCardProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  title,
  children,
  actions,
  className = '',
}) => {
  const { t } = useTranslation();

  const cardStyles: React.CSSProperties = {
    backgroundColor: '#ffffff',
    border: '2px solid #e0e5eb',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e0e5eb',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1a2b3c',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const iconStyles: React.CSSProperties = {
    fontSize: '1.5rem',
  };

  const contentStyles: React.CSSProperties = {
    minHeight: '2rem',
  };

  const emptyStateStyles: React.CSSProperties = {
    textAlign: 'center',
    padding: '2rem',
    color: '#667788',
    fontSize: '0.875rem',
  };

  const hasContent = React.Children.count(children) > 0;

  return (
    <div style={cardStyles} className={className}>
      <div style={headerStyles}>
        <h3 style={titleStyles}>
          <span style={iconStyles}>🚛</span>
          {t(title)}
        </h3>
        {actions && <div>{actions}</div>}
      </div>

      <div style={contentStyles}>
        {hasContent ? (
          children
        ) : (
          <div style={emptyStateStyles}>
            {t('NO_EQUIPMENT_EXPERIENCE_PROVIDED')}
            <br />
            <small>{t('CLICK_ADD_TO_GET_STARTED')}</small>
          </div>
        )}
      </div>
    </div>
  );
};
