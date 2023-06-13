export type SearchJobFilterProps = {
    state: any;
    method: any;
    open?: boolean | (() => boolean);
    withAll?: boolean | (() => boolean);
    hide?: any[];
}