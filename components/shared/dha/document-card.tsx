import React from 'react';
import { useTranslation } from '../../../hooks/use-translation';

interface DocumentCardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  title,
  subtitle,
  icon = '📄',
  children,
  actions,
  className = '',
}) => {
  const { t } = useTranslation();

  const cardStyles: React.CSSProperties = {
    backgroundColor: 'var(--light)',
    border: '2px solid var(--medium-gray)',
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
    borderBottom: '1px solid var(--medium-gray)',
  };

  const titleContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    margin: 0,
  };

  const iconStyles: React.CSSProperties = {
    fontSize: '1.5rem',
  };

  const contentStyles: React.CSSProperties = {
    minHeight: '2rem',
  };

  return (
    <div style={cardStyles} className={className}>
      <div style={headerStyles}>
        <div style={titleContainerStyles}>
          <h3 style={titleStyles}>
            <span style={iconStyles}>{icon}</span>
            {t(title)}
          </h3>
          {subtitle && <p style={subtitleStyles}>{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>

      <div style={contentStyles}>{children}</div>
    </div>
  );
};
