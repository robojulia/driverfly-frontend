import { useTranslation } from "../../hooks/useTranslation";

/**
 * 
 * @param {object} props 
 * @param {Date|string} props.date
 * @returns 
 */
export default function When(props) {
    let { date } = props;
    
    const { t } = useTranslation();

    if (!(date instanceof Date)) date = new Date(date);

    const diff = new Date().getTime() - date.getTime();

    const days = Math.floor(diff / 86400000);
    if (days > 1) {
        return date.toISOString();
    }
    else if (days === 1) {
        return t("YESTERDAY");
    }

    const hrs = Math.floor(diff / 3600000);
    if (hrs > 0) {
        return t("{hours}_HOURS_AGO", { hours: hrs });
    }
    
    const mins = Math.floor(diff / 60000);
    if (mins > 0) {
        return t("{minutes}_MINUTES_AGO", { minutes: mins });
    }

    const sec = Math.floor(diff / 1000);
    if (sec > 0) {
        return t("{seconds}_SECONDS_AGO", { seconds: sec });
    }

    return t("JUST_NOW");
}
