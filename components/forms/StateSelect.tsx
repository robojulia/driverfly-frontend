import BaseSelect, { BaseSelectProps } from "./BaseSelect";
import stateList from "../../utils/stateList";

export default function StateSelect ( props: BaseSelectProps )
{

    return (<BaseSelect
        {...props}
        options={stateList}
        valueKey="value"
        labelKey="label"
        />
        )

}