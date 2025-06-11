/**
 *
 * @param {string|Date} birthday
 * @returns
 */
function calculateAge(birthday) {
  // birthday is a date
  if (!birthday) return;

  if (typeof birthday == 'string') birthday = new Date(birthday);

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
  let range = '';

  if (start_at && typeof start_at == 'string') start_at = new Date(start_at);
  if (end_at && typeof end_at == 'string') end_at = new Date(end_at);

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

const isBirthdayThisWeek = (birthdateStr) => {
  const today = new Date();
  const birthday = new Date(birthdateStr);
  birthday.setFullYear(today.getFullYear());

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday

  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (7 - today.getDay())); // Sunday

  return birthday >= startOfWeek && birthday <= endOfWeek;
};

export { calculateAge, dateRange, isExpired, isBirthdayThisWeek };
