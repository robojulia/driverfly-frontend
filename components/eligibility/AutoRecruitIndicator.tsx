import React from 'react';
import { Lightning } from 'react-bootstrap-icons';
import styles from './AutoRecruitIndicator.module.css';

interface AutoRecruitIndicatorProps {
  className?: string;
}

const AutoRecruitIndicator: React.FC<AutoRecruitIndicatorProps> = ({ className = '' }) => {
  return (
    <div className={`${styles.autoRecruitIndicator} ${className}`} title="Auto-recruited">
      <Lightning className={styles.lightningIcon} size={14} />
    </div>
  );
};

export default AutoRecruitIndicator;
