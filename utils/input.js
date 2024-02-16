function preventNegative(e) {
    if (e.key == "-") e.preventDefault();
}

function positiveInt(e) {
    switch (e.key) {
        case "-":
        case ".":
            e.preventDefault();
            return;
    }

}

module.exports = {
    preventNegative,
    positiveInt
};