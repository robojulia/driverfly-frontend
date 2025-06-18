import React from 'react';
import { useTranslation } from '../../../hooks/use-translation';

interface EquipmentCardProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  emptyStateText?: string;
  emptyStateSubtext?: string;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  title,
  children,
  actions,
  className = '',
  emptyStateText,
  emptyStateSubtext,
}) => {
  const { t } = useTranslation();

  // Responsive hook to detect screen size
  const [screenWidth, setScreenWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine responsive values based on screen width
  const isMobile = screenWidth <= 576;
  const isSmallMobile = screenWidth <= 480;

  const cardStyles: React.CSSProperties = {
    backgroundColor: 'var(--light)',
    border: isSmallMobile ? '1px solid var(--medium-gray)' : '2px solid var(--medium-gray)',
    borderRadius: isSmallMobile ? '8px' : '12px',
    padding: isSmallMobile ? '0.75rem' : isMobile ? '0rem' : '1.5rem',
    marginBottom: isSmallMobile ? '0.75rem' : isMobile ? '1rem' : '1.5rem',
    boxShadow: isSmallMobile ? '0 1px 4px rgba(0, 0, 0, 0.05)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isSmallMobile ? '0.75rem' : isMobile ? '1rem' : '1.5rem',
    paddingBottom: isSmallMobile ? '0.5rem' : isMobile ? '0.75rem' : '1rem',
    borderBottom: '1px solid var(--medium-gray)',
    flexWrap: isSmallMobile ? 'wrap' : 'nowrap',
    gap: isSmallMobile ? '0.5rem' : '1rem',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: isSmallMobile ? '1rem' : isMobile ? '1.125rem' : '1.25rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: isSmallMobile ? '0.375rem' : '0.5rem',
    flex: isSmallMobile ? '1 1 100%' : 'none',
  };

  const iconStyles: React.CSSProperties = {
    fontSize: isSmallMobile ? '1.25rem' : '1.5rem',
    flexShrink: 0,
  };

  const contentStyles: React.CSSProperties = {
    minHeight: '2rem',
  };

  const emptyStateStyles: React.CSSProperties = {
    textAlign: 'center',
    padding: isSmallMobile ? '1rem' : isMobile ? '1.5rem' : '2rem',
    color: 'var(--text-secondary)',
    fontSize: isSmallMobile ? '0.8rem' : '0.875rem',
    lineHeight: '1.4',
  };

  const hasContent = React.Children.count(children) > 0;

  // Default empty state messages
  const defaultEmptyText = emptyStateText || t('NO_EQUIPMENT_EXPERIENCE_PROVIDED');
  const defaultEmptySubtext = emptyStateSubtext || t('CLICK_ADD_TO_GET_STARTED');

  return (
    <div style={cardStyles} className={className}>
      <div style={headerStyles}>
        <h3 style={titleStyles}>
          <span style={iconStyles}>🚛</span>
          {t(title)}
        </h3>
        {actions && (
          <div
            style={{
              flex: isSmallMobile ? '1 1 100%' : 'none',
              display: 'flex',
              justifyContent: isSmallMobile ? 'center' : 'flex-end',
              marginTop: isSmallMobile ? '0.5rem' : '0',
            }}
          >
            {actions}
          </div>
        )}
      </div>

      <div style={contentStyles}>
        {hasContent ? (
          children
        ) : (
          <div style={emptyStateStyles}>
            {defaultEmptyText}
            <br />
            <small>{defaultEmptySubtext}</small>
          </div>
        )}
      </div>
    </div>
  );
};
