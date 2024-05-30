
export function focusOnErrorField(form): void {
    try {
        const errorKeys = Object.keys(form.errors);

        if (!!errorKeys.length && form.submitCount > 0) {

            const errorKey = errorKeys[0];
            let id: string;

            if (Array.isArray(form.errors[errorKey])) {
                const index = form.errors[errorKey]?.findIndex(Boolean)
                // console.log("form.errors[errorKey]", `${errorKey}[${index}].${Object.keys(form.errors[errorKey][index])[0]}`);
                id = (`${errorKey}[${index}].${Object.keys(form.errors[errorKey][index])[0]}` == `documents[${index}].name` ? `documents[${index}]` : `${errorKey}[${index}].${Object.keys(form.errors[errorKey][index])[0]}`);
            } else if (typeof form.errors[errorKey] == "object" && form.errors[errorKey]?.length > 0) {
                id = (`${errorKey}[0].${Object.keys(form.errors[errorKey][0])[0]}`);
            } else {
                id = (`${errorKey}`);
            }

            const firstElement = document.getElementById(id);

            if (firstElement !== document.activeElement) {
                firstElement?.focus();
            }
        }
    } catch (error) {
        console.error(error.message);
    }
}