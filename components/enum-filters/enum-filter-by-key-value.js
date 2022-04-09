import { useTranslation } from "react-i18next";

export default function EnumFilterByKeyValue(props) {
    const { t } = useTranslation();
    return (
        <>
            {props.withAll &&
                <div class="topping ">
                    <input
                        onChange={props.handleChange}
                        type="radio"
                        name={props.name}
                        value="" /> All
                </div>
            }
            {Object.keys(props.enumArray).map((key) => {
                return (
                    <>
                        <div class="topping pt-2">
                            <input
                                onChange={props.handleChange}
                                type="radio"
                                name={props.name}
                                value={key} /> {props.translate ? t(props.enumArray[key].toLowerCase()) : props.enumArray[key]}
                        </div>
                    </>
                )
            })}
        </>
    )
}