import { useTranslation } from "react-i18next";
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
                        checked={(!filters[props.name]) || (filters[props.name] == "")}
                        onChange={props.handleChange}
                        type="radio"
                        name={props.name}
                        value="" /> All
                </div>
            }
            {Object.keys(props.enumArray).map((key) => {
                return (
                    <div key={key} className="topping pt-2">
                        <input
                            onChange={props.handleChange}
                            type="radio"
                            name={props.name}
                            value={key} /> {props.translate ? t(props.enumArray[key].toLowerCase()) : props.enumArray[key]}
                    </div>
                )
            })}
        </>
    )
}