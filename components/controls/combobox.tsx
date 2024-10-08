import { useRef, useState } from "react";
import Select, { StylesConfig } from "react-select";
import { useTranslation } from "../../hooks/use-translation";

import { useEffectAsync } from "../../utils/react";
import { ChattableType } from "../../enums/conversation/chattable-type.enum";
import ApplicantApi from "../../pages/api/applicant";
import EmployeeApi from "../../pages/api/employee";
import { ApplicantEntity } from "../../models/applicant";

export interface ComboboxProps {
    label?: string;
    name?: string;
    minLength?: number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement> | any) => void;
    options?: ComboboxItem[] | ((search: string) => Promise<ComboboxItem[]>);
}
export interface ComboboxItem {
    text: string;
    value: any;
    parts?: string[]
}

const csutomStyles: StylesConfig<ComboboxItem & any> = {
    placeholder: (styles: any, { isFocused }) => ({
        ...styles,
        color: "black",
        fontWeight: "lighter"
    }),
    clearIndicator: (styles: any, { isFocused }) => ({
        ...styles,
        color: "black",
        borderColor: isFocused ? "#2ec8c4" : "#4ca7a8",
    }),
    container: (styles: any, { isFocused }) => ({
        ...styles,
        width: "100%",
        borderColor: isFocused ? "#2ec8c4" : "#4ca7a8",
    }),
    control: (styles: any, { isFocused, menuIsOpen }) => ({
        ...styles,
        backgroundColor: "white",
        color: "black",
        borderColor: isFocused || menuIsOpen
            ? "#2ec8c4"
            : "#4ca7a8",
    }),
    option: (styles: any, { data, isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            zIndex: 9999,
            color: isFocused || isSelected
                ? "white"
                // : data?.value?.chattable_type == ChattableType.EMPLOYEE
                //     ? '#2ec8c4'
                : "black",
            backgroundColor: isFocused
                ? "#2ec8c4"
                : isSelected
                    ? "#4ca7a8"
                    : "white",
        };
    },
};


export default function Combobox(props: ComboboxProps) {
    const { label, name, onChange, ...rest } = props;

    const minLength = props.minLength || 1;

    const { t } = useTranslation();

    const selectInputRef = useRef(null);

    // const [query, setQuery] = useState<string>("");
    const [options, setOptions] = useState<ComboboxItem[]>([]);

    const getOptions = async () => {
        const applicantApi = new ApplicantApi();
        const employeeApi = new EmployeeApi();

        const applicants = (
            (await applicantApi.list({
                without: [
                    "jobs",
                    "equipment_experience",
                    "applicant_dac",
                    "applicant_extras",
                ],
                is_paginated: false,
            })) as ApplicantEntity[]
        )?.filter((v) => !!v?.phone);
        const employees = (await employeeApi.list())?.filter(ap => !!ap?.phone);

        return [
            ...applicants?.map(v => ({
                // text: `${v.first_name} ${v.last_name} (${t("ChattableType." + Boolean(v?.user?.id) ? ChattableType.USER : ChattableType.APPLICANT)}) `,
                text: `${v.first_name} ${v.last_name} (${t("ChattableType." + ChattableType.APPLICANT)})`,
                value: {
                    chattable_type: Boolean(v.user) ? ChattableType.USER : ChattableType.APPLICANT,
                    chattable_id: v.user?.id || v.id,
                    chattable_name: v.user?.name || `${v.first_name} ${v.last_name}`
                }
            })),
            ...employees?.map(v => ({
                text: `${v.first_name} ${v.last_name} (${t("ChattableType." + ChattableType.EMPLOYEE)})`,
                value: {
                    chattable_type: ChattableType.EMPLOYEE,
                    chattable_id: v.id,
                    chattable_name: `${v.first_name} ${v.last_name}`
                }
            })),
        ];
    };
    useEffectAsync(async () => {
        setOptions(await getOptions())
    }, [])

    const onOptionClick = (e: { value: any; }, _actionMeta: any): void => {
        if (onChange) {
            onChange({
                target: {
                    name: name,
                    value: e?.value
                }
            })
        }
    };

    // const fetchOptions = async () => {
    //     let opts = typeof rest?.options == "function" ? rest.options(query) : rest?.options;

    //     if (opts instanceof Promise) opts = await opts;

    //     setOptions(opts
    //         ?.map(o => {
    //             const { text, value } = o;

    //             const textStart = text.toLowerCase().indexOf(query);
    //             const textEnd = textStart + query.length;

    //             if (textStart < 0) return null;

    //             return {
    //                 text,
    //                 value,
    //                 parts: [text.substring(0, textStart), text.substring(textStart, textEnd), text.substring(textEnd)]
    //             };
    //         }).filter(o => !!o) || []
    //     );
    // }
    // useEffectAsync(async () => await fetchOptions(), []);

    // useEffectAsync(async () => await fetchOptions(), [query]);

    return (
        <>
            {label && <label htmlFor={name}>{t(label)}</label>}

            <Select
                ref={selectInputRef}
                styles={csutomStyles}
                className="basic-single"
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                options={options?.map((v) => ({ value: v.value, label: v.text }))}
                // onInputChange={(newValue) => setQuery(newValue)}
                onChange={onOptionClick}
            />
        </>
    );
}