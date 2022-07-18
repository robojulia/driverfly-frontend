import { useTranslation } from "../../hooks/useTranslation";
import { Card } from "react-bootstrap";
import { CardBody, CardHeader } from "reactstrap";

export interface ViewCardProps {
    title?: string;
    readonly children?: any;
    actions?: JSX.Element | JSX.Element[];
}

export default function ViewCard(props: ViewCardProps) {
    const { t } = useTranslation();

    const { title, actions, children } = props;

    return (
        <Card >
            {(title || actions) && <CardHeader>
                {title && <div style={{float: "left"}}>{t(title)}</div>}
                {actions && <div style={{float: "right"}}>{actions}</div>}
            </CardHeader>}
            {children && <CardBody>{children}</CardBody>}
        </Card>
    );

}