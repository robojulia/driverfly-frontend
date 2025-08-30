import React from 'react';
import { BriefcaseFill } from 'react-bootstrap-icons';
import styles from './HiredIndicator.module.css';

interface HiredIndicatorProps {
  className?: string;
}

const HiredIndicator: React.FC<HiredIndicatorProps> = ({ className = '' }) => {
  return (
    <div className={`${styles.hiredIndicator} ${className}`} title="Already hired by company">
      <BriefcaseFill className={styles.briefcaseIcon} size={14} />
    </div>
  );
};

export default HiredIndicator;
