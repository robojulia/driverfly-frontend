
export function ShowUsFormattedDateTime(date: Date | string, skipTime?: boolean) {
    if (!date) return ``;

    date = typeof date == 'string' ? new Date(date) : date;
    const formattedDate = date?.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });

    const formattedTime = date?.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    return `${formattedDate} ${!skipTime ? formattedTime : ""}`;
}