import React from 'react';

interface InfoCardProps {
  title: string;
  message: string;
  icon?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  message,
  icon = 'ℹ️',
  variant = 'info',
}) => {
  const getVariantColors = (variant: string) => {
    switch (variant) {
      case 'success':
        return {
          borderColor: 'var(--success)',
          iconColor: 'var(--success)',
        };
      case 'warning':
        return {
          borderColor: 'var(--warning)',
          iconColor: 'var(--warning)',
        };
      case 'error':
        return {
          borderColor: 'var(--danger)',
          iconColor: 'var(--danger)',
        };
      default: // info
        return {
          borderColor: 'var(--primary)',
          iconColor: 'var(--primary)',
        };
    }
  };

  const colors = getVariantColors(variant);

  const styles = {
    container: {
      marginTop: '1.5rem',
      padding: '1.25rem',
      backgroundColor: 'var(--form-info-bg)',
      border: '1px solid var(--medium-gray)',
      borderRadius: '8px',
      borderLeft: `4px solid ${colors.borderColor}`,
    },
    content: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
    },
    icon: {
      fontSize: '1.25rem',
      color: colors.iconColor,
      marginTop: '0.125rem',
    },
    textContainer: {
      flex: 1,
    },
    title: {
      margin: 0,
      marginBottom: '0.5rem',
      fontSize: '1rem',
      fontWeight: '600' as const,
      color: 'var(--text-primary)',
    },
    message: {
      margin: 0,
      color: 'var(--text-secondary)',
      lineHeight: '1.5',
      fontSize: '0.9375rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.icon}>{icon}</div>
        <div style={styles.textContainer}>
          <h4 style={styles.title}>{title}</h4>
          <p style={styles.message}>{message}</p>
        </div>
      </div>
    </div>
  );
};
