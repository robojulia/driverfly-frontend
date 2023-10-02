import { ReactNode } from "react";
import { OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import { useTranslation } from "../../hooks/use-translation";

export interface OverlyPopoverProps {
    str?: string;
    skipTranslate?: boolean;
    labelPrefix?: string;
    header?: string | ReactNode;
    icon?: ReactNode;
    slice_at?: number;
    readonly children?: string | React.ReactChildren | React.ReactChild;
}

export default function OverlyPopover({
    str,
    skipTranslate,
    labelPrefix,
    header,
    icon,
    slice_at,
    children
}: OverlyPopoverProps) {
    const { t } = useTranslation();
    if (!str) return (<></>)

    const templateString = skipTranslate ? str : t((labelPrefix ? labelPrefix + "." : "") + str)

    const popover = (
        <Popover id="popover-basic">
            {
                header &&
                <Popover.Header as="h3">{header}</Popover.Header>
            }
            <Popover.Body>
                {icon ?? null}
                {templateString}
            </Popover.Body>
        </Popover>
    );

    return <OverlayTrigger
        placement="bottom"
        delay={{ show: 250, hide: 400 }}
        overlay={popover}
    >
        {children ?
            <span>{children}</span>
            :
            <span >
                {icon ?? null}
                {slice_at ? templateString.slice(0, slice_at) : templateString}...
            </span>
        }
    </OverlayTrigger>
}