function isBrowser() {
    return typeof window != "undefined";
}
function buildAddress(props?: {
    street?: string;
    city?: string;
    state?: string;
    zip_code?: string;
}) {
    if (!props) return;

    const { street, city, state, zip_code } = props;

    let address = "";

    if (street) address += street;

    if (city) address += (address.length > 0 ? ", " : "") + city;

    if (state) address += (address.length > 0 ? ", " : "") + state;

    if (zip_code) address += (address.length > 0 ? ", " : "") + zip_code;

    return address;
}
function generateUUID() {
    // Public Domain/MIT
    var d = new Date().getTime(); //Timestamp
    var d2 =
        (typeof performance != "undefined" &&
            performance.now &&
            performance.now() * 1000) ||
        0; //Time in microseconds since page-load or 0 if unsupported
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = Math.random() * 16; //random number between 0 and 16
        if (d > 0) {
            //Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            //Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
}
function buildArrayQueryString(key: string, array: any[]): string {
    const encodedArray = array.map((item) => encodeURIComponent(item));
    return `${key}=${encodedArray.join("&" + key + "=")}`;
}

function slugify(str: string) {
    return String(str)
        .normalize("NFKD") // split accented characters into their base characters and diacritical marks
        .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
        .trim() // trim leading or trailing whitespace
        .toLowerCase() // convert to lowercase
        .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
        .replace(/\s+/g, "-") // replace spaces with hyphens
        .replace(/-+/g, "-"); // remove consecutive hyphens
}

function buildReferral(props: {
    name?: string;
    code?: string;
    source?: string;
    medium?: string;
}) {
    // if (!props) return;

    const { name, code, source, medium } = props;

    let referral = "";

    if (name) referral += name;

    if (code) referral += (referral.length > 0 ? ", " : "") + code;

    if (source) referral += (referral.length > 0 ? ", " : "") + source;

    if (medium) referral += (referral.length > 0 ? ", " : "") + medium;

    return referral;
}

export {
    buildAddress,
    buildArrayQueryString,
    generateUUID,
    isBrowser,
    slugify,
    buildReferral,
};
