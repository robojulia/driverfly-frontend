import { useTranslation } from "../../hooks/useTranslation";

export default function EnumFilterByKeyValue(props) {

    const { t } = useTranslation();
    const { state, method } = props
    const { filters } = state

    return (
        <>
            {props.withAll &&
                <div className="topping ">
                    <input
                        defaultChecked={(!filters[props.name]) || (filters[props.name] == "")}
                        onChange={props.handleChange}
                        type="radio"
                        name={props.name}
                        value="" /> {t('ALL')}
                </div>
            }
            {Object.values(props.enumArray).map((value) => {
                return (
                    <div key={value} className="topping pt-2">
                        <input
                            defaultChecked={(filters[props.name]) && (filters[props.name] == value)}
                            onChange={props.handleChange}
                            type="radio"
                            name={props.name}
                            value={value} /> {props.translate ? t((props.labelPrefix ? props.labelPrefix + "." : "") + value) : value}
                    </div>
                )
            })}
        </>
    )
}