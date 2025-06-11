import { useTranslation } from "../../hooks/use-translation";
import timeSince from "../../utils/timeSince";

interface FormattedDateProps {
    date: Date | string;
    labelPrefix?: string;
    labelPostfix?: string;
    hideTime?: boolean | (() => boolean);
    showTimeSince?: boolean | (() => boolean);
    className?: string;
}

export default function ShowFormattedDate({ date, labelPrefix, labelPostfix, hideTime, showTimeSince, className }: FormattedDateProps) {

    const { t } = useTranslation();

    if (!Boolean(date)) return <></>

    let displayDate: Date | string;

    if (showTimeSince) {
        displayDate = timeSince(date)
    } else {
        displayDate = formatDate(date, Boolean(hideTime))
    }

    return (
        <span className={`${className}`}>
            {labelPrefix && t(labelPrefix)}&nbsp;
            {displayDate}&nbsp;
            {labelPostfix && t(labelPostfix)}&nbsp;
        </span>
    );
}

export function formatDate(date: Date | string, hideTime?: boolean) {
    const formatter = new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: !!!hideTime ? "2-digit" : undefined,
        minute: !!!hideTime ? "2-digit" : undefined,
    });
    return formatter.format(typeof date == 'string' ? new Date(date) : date)
}