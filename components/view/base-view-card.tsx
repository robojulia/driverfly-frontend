import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

interface BaseViewCardProps {
  children: React.ReactNode;
  className?: string;
}

export function BaseViewCard({ children, className = '' }: BaseViewCardProps) {
  return <div className={`view-card ${className}`}>{children}</div>;
}

interface ViewHeaderProps {
  title: string;
  image?: {
    src: string;
    alt: string;
  };
  children?: React.ReactNode;
}

export function ViewHeader({ title, image, children }: ViewHeaderProps) {
  return (
    <div className="view-header">
      {image && (
        <div className="view-image">
          <img src={image.src} alt={image.alt} />
        </div>
      )}
      <div className="view-title">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

interface ViewSectionProps {
  title: string;
  children: React.ReactNode;
}

export function ViewSection({ title, children }: ViewSectionProps) {
  return (
    <div className="view-section">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

interface InfoGridProps {
  children: React.ReactNode;
}

export function InfoGrid({ children }: InfoGridProps) {
  return <div className="info-grid">{children}</div>;
}

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
}

export function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="info-item">
      <span className="info-label">{label}</span>
      <span className="info-value">{value || '-'}</span>
    </div>
  );
}

interface ChipListProps {
  items: Array<{
    id: string | number;
    label: string;
  }>;
}

export function ChipList({ items }: ChipListProps) {
  return (
    <div className="chip-list">
      {items.map((item) => (
        <div key={item.id} className="info-chip">
          {item.label}
        </div>
      ))}
    </div>
  );
}
