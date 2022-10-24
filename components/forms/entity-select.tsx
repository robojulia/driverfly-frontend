import React, { useState } from "react";
import { useAuth } from "../../hooks/use-auth";
import { useEffectAsync } from "../../utils/react";
import BaseSelect, { BaseSelectProps } from "./base-select";
import { toast } from "react-toastify";
import { globalAjaxExceptionHandler } from "../../utils/ajax";
import { useTranslation } from "../../hooks/use-translation";

interface Entity {
    id?: number
}

export interface EntitySelectProps extends BaseSelectProps {
    fetchData: () => Promise<Entity[]>
    options?: Entity[]
}

export function EntitySelect(props: EntitySelectProps) {
    
    const { company } = useAuth();
    const [ items, setItems ] = useState<Entity[]>([]);
    const { t } = useTranslation();

    useEffectAsync(async () => {
        if (props.options) {
            setItems(props.options);
        }
        else {
            try {
                const items = await props.fetchData();
                setItems(items);
            }
            catch (e) {
                globalAjaxExceptionHandler(e, { toast: toast, t: t });
            }
        }
    }, [props.options, company]);

    let { formik, name, value, touched, error, onChange, handleBlur } = props;

    if (formik) {
        /**
         * @type {import('formik').FieldMetaProps}
         */
        const meta = formik.getFieldMeta(name);
    
        if (meta) {
          value = meta.value;
          touched = meta.touched;
          error = meta.error;
        }
        onChange = onChange || formik.handleChange;
        handleBlur = handleBlur || formik.handleBlur;
    }

    function onChangeProxy(e: React.ChangeEvent<HTMLSelectElement>) {
        const { value } = e.target;

        // override types as we are customizing change input
        const entity: any = items.find(v => v.id == +value);

        onChange({
            ...e,
            target: {
                ...e.target,
                name: name,
                value: entity || null
            }
        });
    }

    return (<BaseSelect
        {...props}
        formik={null}
        options={items}
        onChange={onChangeProxy}
        handleBlur={handleBlur}
        value={value?.id}
        touched={touched}
        error={error}
        valueKey="id"
        />
        )
}