import { Placement } from "react-bootstrap/esm/types";

export type ShowEnumFromStringProps = {
    value: string[] | string;
    enumArray?: any;
    separator?: string;
    skipTranslate?: boolean | (() => boolean);
    compareEnum?: boolean | (() => boolean);
    labelPrefix?: string;
    popover_header?: string;
    popover?: boolean | (() => boolean);
    placement?: Placement
}