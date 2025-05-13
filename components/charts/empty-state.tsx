import React from "react";
import { useTranslation } from "../../hooks/use-translation";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "NO_DATA_AVAILABLE",
  message = "NO_DATA_MESSAGE",
  icon,
}) => {
  const { t } = useTranslation();

  return (
    <div className="chart-empty-state">
      <div className="empty-state-content">
        {icon || (
          <div className="empty-state-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32 58.6667C46.7276 58.6667 58.6667 46.7276 58.6667 32C58.6667 17.2724 46.7276 5.33337 32 5.33337C17.2724 5.33337 5.33337 17.2724 5.33337 32C5.33337 46.7276 17.2724 58.6667 32 58.6667Z"
                stroke="#37AEAF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M32 21.3334V32.0001"
                stroke="#37AEAF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M32 42.6666H32.0267"
                stroke="#37AEAF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
        <h4 className="empty-state-title">{t(title)}</h4>
        <p className="empty-state-message">{t(message)}</p>
      </div>
    </div>
  );
};
