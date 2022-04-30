import { useTranslation } from "../../hooks/useTranslation";
import { Card } from "react-bootstrap";
import { CardBody, CardHeader } from "reactstrap";

/**
 * @typedef ViewCardProps
 * @property {string} title
 * @property {any} children
 */

/**
 * @param {ViewCardProps} props
 */
export default function ViewCard(props) {
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