/**
 * 
 * @param {Error} error
 * @param {object} interfaces 
 * @param {import("formik").FormikConfig} interfaces.formik
 * @param {ToastInterface} interfaces.toast 
 * @param {(string) => string} interfaces.t const { t } = useTranslation() interface
 * @returns {boolean} true if handled fully, false if not
 */
function globalAjaxExceptionHandler(error, interfaces) {
    if (!error) return true;

    const { formik, toast, t } = interfaces;

    const { response } = error;

    if (response?.data) {
        const { data } = error.response;

        if (typeof data === "string") {
            console.error(`globalAjaxExceptionHandler: encountered - ${data}`, response, error);
            if (toast) {
                toast?.error(t(data));
                return true; // we consider this safely handled via toast
            }
        }

        if (typeof data === "object") {
            // class-validator standard structure
            if (data.statusCode && data.error && data.message) {
                const { message } = data;

                const messages = message instanceof Array ? message : [message];

                console.error(`globalAjaxExceptionHandler: encountered`, data, response, error);
                if (toast) {
                    messages.forEach(v => toast.error(t(v)));
                    return true; // we consider this safely handled via toast
                }
    
            }


            console.error(`globalAjaxExceptionHandler: encountered`, data, response, error);

            const fullyHandled = readErrorObj(data, { formik, toast, t });
            if (fullyHandled) {
                // formik?.setErrors({
                //     ...(formik?.errors || {}),
                //     ...data
                // });
                return true; // safely handled via formik
            }

            // complicated if we needed something more advanced.
        }
    }

    console.error(`globalAjaxExceptionHandler: encountered`, error);
    if (toast) {
        toast?.error(t('ERROR_MESSAGE_DEFAULT'));
        return true; // handled via toast
    }

    function readErrorObj(data, { formik, toast, t, keyPrefix }) {
        if (data instanceof Array) {
            return data.every((value, key) => handleValue(`${keyPrefix || ""}[${key}]`, value));
        }

        if (typeof data === "object") {
            return Object.entries(data).every(([key, value]) => handleValue(`${keyPrefix || ""}${keyPrefix ? "." : ""}${key}`, value));
        }

        return false;

        function handleValue(key, value) {
            if (typeof value === "object") {
                return readErrorObj(data, { formik, toast, t, keyPrefix: key });
            }

            if (typeof value === "string") {
                /**
                 * @type {import('formik').FieldMetaProps}
                 */
                const meta = formik?.getFieldMeta(key);
                if (meta) {
                    /**
                     * @type {import('formik').FieldHelperProps}
                     */
                    const { setError, setTouched } = formik.getFieldHelpers(key);
                    setError(t(value));
                    setTouched(true);
                    return true;
                }
                else if (toast) {
                    toast.error(t(value));
                    return true;
                }
             }

             return false;
        }

    }

    return false; // unhandled
}

export {
    globalAjaxExceptionHandler
};