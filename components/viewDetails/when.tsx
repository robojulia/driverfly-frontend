import { useTranslation } from "../../hooks/useTranslation";

export default function When(props: { date: Date|string }) {
    let { date } = props;
    
    const { t } = useTranslation();

    if (!(date instanceof Date)) date = new Date(date);

    const diff = new Date().getTime() - date.getTime();

    let when = "";

    const days = Math.floor(diff / 86400000);
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor(diff / 60000);
    const sec = Math.floor(diff / 1000);

    if (days > 1) {
        when = date.toLocaleString();
    }
    else if (days === 1) {
        when = t("YESTERDAY");
    }
    else if (hrs > 0) {
        when = t("{hours}_HOURS_AGO", { hours: hrs.toString() });
    }
    else if (mins > 0) {
        when = t("{minutes}_MINUTES_AGO", { minutes: mins.toString() });
    }
    else if (sec > 0) {
        when = t("{seconds}_SECONDS_AGO", { seconds: sec.toString() });
    }
    else {
        when = t("JUST_NOW");
    }

    return (<>{when}</>)
}
