import { TranslateInterface } from "../hooks/use-translation";
import { FormikInterface } from "./formik";
import { ToastInterface } from "./toast";

interface AjaxError extends Error {
    response?: {
        data?: string | ClassValidatorError | InternalError | InternalErrorMessage
    }
}

interface ClassValidatorError {
    statusCode: number;
    error?: any;
    message: string | string[];
}

function isClassValidatorError(obj: unknown): obj is ClassValidatorError {
    return Object.prototype.hasOwnProperty.call(obj, "statusCode")
        // && Object.prototype.hasOwnProperty.call(obj, "error")
        && Object.prototype.hasOwnProperty.call(obj, "message");
}

interface InternalError {
    [key: string | number]: string | InternalErrorMessage | InternalError;
}

interface InternalErrorMessage {
    context?: {
        [key: string]: any;
    };
    error?: string;
}

function isInternalErrorMessage(obj: unknown): obj is InternalErrorMessage {
    return Object.prototype.hasOwnProperty.call(obj, "context")
        && Object.prototype.hasOwnProperty.call(obj, "error");
}

function globalAjaxExceptionHandler(error: AjaxError, interfaces: { formik?: FormikInterface<any>, t: TranslateInterface, defaultMessage?: string, toast?: ToastInterface }) {
    if (!error) return true;

    const { formik, toast, t, defaultMessage } = interfaces;

    const { response } = error;

    if (response?.data) {
        const { data } = error.response;

        if (typeof data == "string") {
            console.error(`globalAjaxExceptionHandler: encountered - ${data}`, response, error);
            if (toast) {
                toast?.error(t(data));
                return true; // we consider this safely handled via toast
            }
        }

        if (typeof data == "object") {
            // class-validator standard structure
            if (isClassValidatorError(data)) {
                const { message } = data;

                const messages = message instanceof Array ? message : [message];

                console.error(`globalAjaxExceptionHandler: encountered`, data, response, error);
                if (toast) {
                    messages.forEach(v => toast.error(t(v)));
                    return true; // we consider this safely handled via toast
                }
            } else {
                console.error(`globalAjaxExceptionHandler: encountered`, data, response, error);

                const fullyHandled = readErrorObj(data);
                if (fullyHandled) {
                    // formik?.setErrors({
                    //     ...(formik?.errors || {}),
                    //     ...data
                    // });
                    return true; // safely handled via formik
                }
            }

            // complicated if we needed something more advanced.
        }
    }

    console.error(`globalAjaxExceptionHandler: encountered`, error);
    if (toast) {
        toast.error(t(defaultMessage || 'ERROR_MESSAGE_DEFAULT'));
        return true; // handled via toast
    }

    function readErrorObj(data: InternalError | InternalErrorMessage, keyPrefix?: string) {
        if (data instanceof Array) {
            return data.every((value, key) => handleValue(`${keyPrefix || ""}[${key}]`, value));
        }

        if (isInternalErrorMessage(data)) {
            toast.error(t(data.error, data.context, { translateProps: true }));
            return true;
        }

        return Object.entries(data).every(([key, value]) => handleValue(`${keyPrefix || ""}${keyPrefix ? "." : ""}${key}`, value));

        function handleValue(key, value: string | InternalError | InternalErrorMessage) {
            let context;
            if (isInternalErrorMessage(value)) {
                context = value.context;
                value = value.error;
            }

            if (typeof value == "string") {
                const meta = formik?.getFieldMeta(key);
                if (meta) {
                    const { setError, setTouched } = formik.getFieldHelpers(key);
                    setError(t(value));
                    setTouched(true, false);

                    // Also show a toast for backend errors so users see the actual error message
                    // This prevents confusion from generic form validation messages
                    if (toast) {
                        toast.error(t(value, context, { translateProps: true }));
                    }
                    return true;
                }
                else if (toast) {
                    toast.error(t(value, context, { translateProps: true }));
                    return true;
                }

                return false;
            }

            return readErrorObj(value, key);
        }
    }

    return false; // unhandled
}

export {
    globalAjaxExceptionHandler
};