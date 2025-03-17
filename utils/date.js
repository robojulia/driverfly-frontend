/**
 * 
 * @param {string|Date} birthday 
 * @returns 
 */
function calculateAge(birthday) { // birthday is a date
    if (!birthday) return;

    if (typeof birthday == "string")
        birthday = new Date(birthday);

    var ageDifMs = Date.now() - birthday;
    var ageDate = new Date(ageDifMs); // miliseconds from epoch

    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

/**
 * 
 * @param {Date|string} start_at 
 * @param {Date|string} end_at 
 * @param {string} default_end_at
 */
function dateRange(start_at, end_at, default_end_at) {
    let range = "";

    if (start_at && typeof start_at == "string") start_at = new Date(start_at);
    if (end_at && typeof end_at == "string") end_at = new Date(end_at);

    if (start_at && end_at) return `${start_at.toDateString()} - ${end_at.toDateString()}`;

    if (start_at && default_end_at) return `${start_at.toDateString()} - ${default_end_at}`;

    if (start_at) return `${start_at.toDateString()}`;

    // assume bad data
}

function isExpired(dateString) {
    const givenDate = new Date(dateString);
    const currentDate = new Date();

    return givenDate < currentDate;
}

export {
    calculateAge,
    dateRange,
    isExpired
};
