function preventNegative(e) {
    if (e.key === "-") e.preventDefault();
}

module.exports = {
    preventNegative
};