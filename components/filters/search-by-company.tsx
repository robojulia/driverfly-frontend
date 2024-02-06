import { useEffect, useRef, useState } from "react";
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

    const selectInputRef = useRef(null);
    const onClear = () => {
        selectInputRef?.current?.clearValue();
    };

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
        control: (styles:any) => ({ ...styles, backgroundColor: "white" }),
        option: (styles:any, { data, isDisabled, isFocused, isSelected }) => {
            return {
                ...styles,
                zIndex: 9999,
            };
        },
    };

    useEffect(() => {
        if (!Boolean(filters?.companyId)) onClear();
    }, [filters?.companyId]);

    return (
        <>
            <label className={labelClassName || "heading-label my-4"}>
                {label || t("COMPANY_NAME")}{" "}
            </label>
            {/* <Select
                ref={selectInputRef}
                name="companyId"
                styles={csutomStyles}
                className="basic-single"
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                options={options}
                // value={options.find(v => v?.value == filters?.companyId)}
                defaultValue={filters?.companyId}
                onChange={(v: any) => setFiltersByKeyValue("companyId", v?.value)}
            /> */}
        </>
    );
}
