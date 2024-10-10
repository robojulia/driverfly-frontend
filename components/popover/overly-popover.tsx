import { ReactNode } from "react";
import { OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import { useTranslation } from "../../hooks/use-translation";
import { Placement } from "react-bootstrap/esm/types";
import { OverlayTriggerType } from "react-bootstrap/esm/OverlayTrigger";

export interface OverlyPopoverProps {
    str?: string;
    placement?: Placement;
    trigger?: OverlayTriggerType | OverlayTriggerType[];
    skipTranslate?: boolean;
    labelPrefix?: string;
    header?: string | ReactNode;
    icon?: ReactNode;
    slice_at?: number;
    readonly children?: string | React.ReactChildren | React.ReactChild;
    className?: string;
}

export default function OverlyPopover({
    str,
    placement,
    trigger,
    skipTranslate,
    labelPrefix,
    header,
    icon,
    slice_at,
    children,
    className
}: OverlyPopoverProps) {
    const { t } = useTranslation();
    if (!str) return (<></>)

    const templateString = skipTranslate ? str : t((labelPrefix ? labelPrefix + "." : "") + str)

    const popover = (
        <Popover id="popover-basic tooltip-disabled">
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

    return (
        <div className={className}>
            <OverlayTrigger
                trigger={trigger}
                placement={placement ?? "bottom"}
                delay={{ show: 50, hide: 150 }}
                overlay={popover}
            >
                {children ?
                    <>{children}</>
                    :
                    <span >
                        {icon ?? null}
                        {slice_at && slice_at < templateString?.length ? `${templateString.slice(0, slice_at)}...` : templateString}
                    </span>
                }
            </OverlayTrigger>
        </div>);
}