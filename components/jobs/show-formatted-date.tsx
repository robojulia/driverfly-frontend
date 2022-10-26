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

    if (!!!date) return <></>

    const { t } = useTranslation();
    let displayDate: Date | string;

    if (showTimeSince) {
        displayDate = timeSince(date)
    } else {
        const formatter = new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: !!!hideTime ? "2-digit" : undefined,
            minute: !!!hideTime ? "2-digit" : undefined,
        });
        displayDate = formatter.format(typeof date === 'string' ? new Date(date) : date)
    }

    return (
        <span className={className}>
            {labelPrefix && t(labelPrefix)}&nbsp;
            {displayDate}&nbsp;
            {labelPostfix && t(labelPostfix)}&nbsp;
        </span>
    );
}