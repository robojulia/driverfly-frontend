import { useState } from "react";
import Select from 'react-select'
import { useTranslation } from "../../hooks/use-translation";
import CompanyApi from "../../pages/api/company";
import { CompanyEntity } from "../../models/company/company.entity";
import { useEffectAsync } from "../../utils/react";

export default function SearchByCompany(props) {

    const {
        state: { filters },
        method: { setFiltersByKeyValue },
        labelClassName,
        label,
    } = props
    const { t } = useTranslation()
    const companyApi = new CompanyApi()

    const [options, setOptions] = useState<Partial<CompanyEntity>[]>([])

    useEffectAsync(
        async () =>
            await companyApi
                .keywordSearchQuery()
                .then((data) => setOptions(data || []))
                .catch((e) => console.error(e.message)),
        []
    );

    return (
        <>
            <label className={labelClassName || "heading-label my-4"}>{label || t('COMPANY_NAME')} </label>
            <Select
                className="basic-single"
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                name="color"
                options={options}
                defaultValue={filters?.companyId}
                onChange={(v) => {
                    setFiltersByKeyValue('companyId', v?.id)
                }}
            />
        </>
    )
}