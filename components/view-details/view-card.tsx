import React from 'react';
import { Card } from 'react-bootstrap';
import { useTranslation } from '../../hooks/use-translation';

export interface ViewCardProps {
  title?: React.ReactNode;
  actions?: JSX.Element | JSX.Element[];
  children?: React.ReactNode;
  noTitle?: boolean;
  titleAs?: React.ElementType | string; // backward compatibility
  variant?: string; // backward compatibility with previous ViewCard API
}

// Clone of Section component, exposed as ViewCard for compatibility
export default function ViewCard(props: ViewCardProps) {
  const { title, actions, children, noTitle, titleAs, variant } = props;
  const { t } = useTranslation();

  const TitleTag: any = titleAs || 'h5';

  return (
    <Card className={`w-100 ${variant ? `card-${variant}` : ''}`}>
      {!noTitle && (title || actions) && (
        <Card.Header>
          {title && (
            <div style={{ float: 'left' }}>
              <TitleTag className="m-0">{typeof title === 'string' ? t(title) : title}</TitleTag>
            </div>
          )}
          {actions && <div style={{ float: 'right' }}>{actions}</div>}
        </Card.Header>
      )}
      {children && <Card.Body className="my_card_body">{children}</Card.Body>}
    </Card>
  );
}
