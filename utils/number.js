var currencyFormatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 2, // (causes 2500.99 to be printed as $2,501)
});

function toCurrency(num) {
    if (typeof num === "string") num = parseFloat(num);

    if (num == null || isNaN(num)) {
        return "";
    }

    return currencyFormatter.format(num);
}

export {
    toCurrency
};