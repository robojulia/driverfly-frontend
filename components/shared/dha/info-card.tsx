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
          borderColor: '#27ae60',
          iconColor: '#27ae60',
        };
      case 'warning':
        return {
          borderColor: '#f39c12',
          iconColor: '#f39c12',
        };
      case 'error':
        return {
          borderColor: '#e74c3c',
          iconColor: '#e74c3c',
        };
      default: // info
        return {
          borderColor: '#0073b1',
          iconColor: '#0073b1',
        };
    }
  };

  const colors = getVariantColors(variant);

  const styles = {
    container: {
      marginTop: '1.5rem',
      padding: '1.25rem',
      backgroundColor: '#f8f9fa',
      border: '1px solid #e9ecef',
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
      color: '#1a2b3c',
    },
    message: {
      margin: 0,
      color: '#667788',
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
