import { useTranslation } from "../../hooks/use-translation";
import { Card } from "react-bootstrap";

export interface ViewCardProps {
    title?: string;
    titleAs?: React.ElementType;
    variant?: "primary" | "secondary",
    readonly children?: any;
    actions?: JSX.Element | JSX.Element[];
}

export default function ViewCard(props: ViewCardProps) {
    const { t } = useTranslation();

    let { title, actions, children, variant, titleAs: TitleAsCmp } = props;

    function renderTitleCmp() {
        if (TitleAsCmp) return <TitleAsCmp>{t(title)}</TitleAsCmp>

        return <h5>{t(title)}</h5>
    }

    return (
        <Card className={`card-${variant || "primary"}`}
        >
            {(title || actions) && <Card.Header>
                {title && <div style={{float: "left"}}>
                    {renderTitleCmp()}
                </div>}
                {actions && <div style={{float: "right"}}>{actions}</div>}
            </Card.Header>}
            {children && <Card.Body>{children}</Card.Body>}
        </Card>
    );

}