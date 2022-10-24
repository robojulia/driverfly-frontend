import { useTranslation } from "../../hooks/use-translation";

interface EnumFilterProps {
    name: string;
    enumArray: any;
    handleChange: (e?: any) => void;
    withAll?: boolean | (() => boolean);
    translate?: boolean | (() => boolean);
    labelPrefix?: string
    state?: any;
    method?: any
}

export default function EnumFilterByKeyValue(props: EnumFilterProps) {

    const { t } = useTranslation();
    const {
        name,
        handleChange,
        withAll,
        enumArray,
        translate,
        labelPrefix,
        state,
        method
    } = props
    const { filters } = state

    return (
        <>
            {withAll &&
                <div className="topping ">
                    <input
                        checked={(!!!filters[name]) || (filters[name] == "")}
                        onChange={handleChange}
                        type="radio"
                        name={name}
                        value=""
                    /> {t('ALL')}
                </div>
            }
            {Object.values(enumArray).map((value: any) => {
                return (
                    <div key={value} className="topping pt-2">
                        <input
                            checked={(filters[name]) && (filters[name] == value)}
                            onChange={handleChange}
                            type="radio"
                            name={name}
                            value={value}
                        /> {translate ? t((labelPrefix ? labelPrefix + "." : "") + value) : value}
                    </div>
                )
            })}
        </>
    )
}