import BaseSelect from "./BaseSelect";
import stateList from "../../utils/stateList";

export default function StateSelect ( props )
{

    return (<BaseSelect
        {...props}
        options={stateList}
        valueKey="value"
        labelKey="label"
        />
        )

}