import { useTranslation } from "react-i18next";
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

    const { title, children } = props;

    return (
        <Card>
            {title && <CardHeader>{t(title)}</CardHeader>}
            <CardBody>{children}</CardBody>
        </Card>
    );

}