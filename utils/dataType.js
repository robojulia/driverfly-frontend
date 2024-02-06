function forceInt(value) {
    return typeof value == "string" ? parseInt(value) : value;
}

function forceCurrency(value) {
    return typeof value == "string" ? parseFloat(value) : value;
}