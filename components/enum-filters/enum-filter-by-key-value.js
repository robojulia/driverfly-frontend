import { useTranslation } from "../../hooks/useTranslation";
import { useContext } from "react"
import jobContext from "../../context/jobContext"

export default function EnumFilterByKeyValue(props) {
    const { t } = useTranslation();
    const { state, method } = useContext(jobContext)
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
                        value="" /> All
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