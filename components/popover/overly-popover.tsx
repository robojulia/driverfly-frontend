import { ReactNode } from "react";
import { OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import { useTranslation } from "../../hooks/use-translation";

export interface OverlyPopoverProps {
    str?: string;
    skipTranslate?: boolean;
    labelPrefix?: string;
    header?: string|ReactNode;
    icon?: ReactNode;
    slice_at?: number;

    readonly children?: string | React.ReactChildren | React.ReactChild;
}

export default function OverlyPopover(props: OverlyPopoverProps) {
    const { t } = useTranslation();
    if (!props.str) {
        return <></>
    }

    const templateString = props.skipTranslate ? props.str : t((props.labelPrefix ? props.labelPrefix + "." : "") + props.str)

    const popover = (
        <Popover id="popover-basic">
            {
                props.header &&
                <Popover.Header as="h3">{props.header}</Popover.Header>
            }
            <Popover.Body>
                {props.icon ? props.icon : null}
                {templateString}
            </Popover.Body>
        </Popover>
    );

    return <OverlayTrigger
        placement="bottom"
        delay={{ show: 250, hide: 400 }}
        overlay={popover}
    >
        {props.children ? 
            <span>{props.children}</span>
            :
            <span >
                {props.icon ? props.icon : null}
                {props.slice_at ? templateString.slice(0, props.slice_at) : templateString}...
            </span>
        }
    </OverlayTrigger>
}