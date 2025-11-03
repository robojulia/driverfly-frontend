import React from 'react';
import { Card } from 'react-bootstrap';
import { useTranslation } from '../../hooks/use-translation';

export interface SectionProps {
    title?: React.ReactNode;
    actions?: JSX.Element | JSX.Element[];
    children?: React.ReactNode;
    noTitle?: boolean;
}

export default function Section(props: SectionProps) {
    const { title, actions, children, noTitle } = props;
    const { t } = useTranslation();

    return (
        <Card className="w-100">
            {!noTitle && (title || actions) && (
                <Card.Header>
                    {title && (
                        <div style={{ float: 'left' }}>
                            <h5 className="m-0" style={{ fontWeight: 700 }}>{typeof title === 'string' ? t(title) : title}</h5>
                        </div>
                    )}
                    {actions && <div style={{ float: 'right' }}>{actions}</div>}
                </Card.Header>
            )}
            {children && <Card.Body className="my_card_body">{children}</Card.Body>}
        </Card>
    );
}


