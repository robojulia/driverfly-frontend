import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useTranslation } from '../../hooks/use-translation';

interface AutoRecruitingAddonProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => Promise<void>;
  loading?: boolean;
}

export function AutoRecruitingAddon({
  enabled,
  onToggle,
  loading,
}: AutoRecruitingAddonProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-4">
      <Card.Body>
        <div className="flex-grow-1">
          <h5 className="mb-2">Auto Recruiting</h5>
          <p className="text-muted mb-3">
            Automatically match and engage with qualified driver candidates
            based on your job requirements and preferences. Pay per lead with
            hire bonuses.
          </p>
          <Button
            variant="primary"
            size="sm"
            href="https://driverfly.co/contact-us/"
            target="_blank"
            rel="noopener noreferrer"
            as="a"
          >
            Contact Us to Set Up
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
