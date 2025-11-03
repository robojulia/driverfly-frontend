import { toast, ToastContent, ToastOptions } from 'react-toastify'
import { TranslateInterface } from '../hooks/use-translation';

export interface ToastInterface {
    success: ToastMessageInterface;
    info: ToastMessageInterface;
    error: ToastMessageInterface;
    warning: ToastMessageInterface;
}

interface ToastMessageInterface {
    (content: ToastContent, options?: ToastOptions<{}> | undefined): React.ReactText;
}


function formSuccess(t: TranslateInterface, action: "create" | "update" | "delete" | string, name: string) {
    let formAction = "";

    switch (action) {
        case "create":
            formAction = "CREATED";
            break;
        case "update":
            formAction = "UPDATED";
            break;
        case "delete":
            formAction = "DELETED";
            break;
        default:
            formAction = "SAVED";
            break;
    }

    // Allow parent pages to temporarily suppress child success toasts during batch saves
    if (typeof window !== 'undefined') {
        const w: any = window as any;
        if (w.__SUPPRESS_CHILD_TOASTS__) return;
        if (typeof w.__SUPPRESS_CHILD_TOASTS_UNTIL === 'number' && Date.now() < w.__SUPPRESS_CHILD_TOASTS_UNTIL) return;
    }
    toast.success(t("Forms.SUCCESS_{action}_{name}", { action: `Forms.${formAction}`, name: name }, { translateProps: true }));
}

function formFailed(t: (text: string, props: any, options: any) => string, action: "create" | "update" | "delete" | string, name: string) {
    let formAction = "";

    switch (action) {
        case "create":
            formAction = "CREATE";
            break;
        case "update":
            formAction = "UPDATE";
            break;
        case "delete":
            formAction = "DELETE";
            break;
        default:
            formAction = "SAVE";
            break;
    }

    toast.error(t("Forms.FAIL_{action}_{name}", { action: `Forms.${formAction}`, name: name }, { translateProps: true }));
}
export {
    formFailed,
    formSuccess
};