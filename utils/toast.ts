import { toast } from 'react-toastify'


function formSuccess(t: (text: string, props: any, options: any) => string, action: "create" | "update" | "delete" | string, name: string) {
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

function customFailed(t: (text: string) => string, message: string) {

    toast.error(t(message));
}

export {
    customFailed,
    formFailed,
    formSuccess
};