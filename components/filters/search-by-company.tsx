import { useState } from "react";
import Select, { StylesConfig } from "react-select";
import { useTranslation } from "../../hooks/use-translation";
import CompanyApi from "../../pages/api/company";
import { useEffectAsync } from "../../utils/react";
import { CompanyEntity } from "../../models/company/company.entity";

export default function SearchByCompany(props) {
    const {
        state: { filters },
        method: { setFiltersByKeyValue },
        labelClassName,
        label,
    } = props;
    const { t } = useTranslation();
    const companyApi = new CompanyApi();

    const [options, setOptions] = useState<
        { value: number | string; label: string }[]
    >([]);

    useEffectAsync(
        async () =>
            await companyApi
                .keywordSearchQuery()
                .then((data: Partial<CompanyEntity>[]) =>
                    setOptions(data?.map((v) => ({ value: v?.id, label: v?.name })) || [])
                )
                .catch((e) => console.error(e.message)),
        []
    );

    const csutomStyles: StylesConfig = {
        control: (styles) => ({ ...styles, backgroundColor: "white" }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            return {
                ...styles,
                zIndex: 9999,
            };
        },
    };

    return (
        <>
            <label className={labelClassName || "heading-label my-4"}>
                {label || t("COMPANY_NAME")}{" "}
            </label>
            <Select
                styles={csutomStyles}
                className="basic-single"
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                options={options}
                defaultValue={filters?.companyId}
                onChange={(v) => setFiltersByKeyValue("companyId", v?.value)}
            />
        </>
    );
}
