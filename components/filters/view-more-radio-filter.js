import { useState } from "react"
import Collapse from 'react-bootstrap/Collapse'
import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value";

export default function ViewMoreRadioFilter(props) {

    const [open, setOpen] = useState(false);

    const enumArray = Object.values(props.enums)
    const splitAble = enumArray.length > 3 ? true : false
    const firstHalf = splitAble ? enumArray.splice(0, 3) : enumArray
    const secondHalf = splitAble ? enumArray : []

    return (
        <>
            <EnumFilterByKeyValue
                {...props}
                translate={true}
                withAll={true}
                enumArray={firstHalf}
                name={props.name}
                labelPrefix={props.labelPrefix}
                handleChange={props.handleChange}
            />
            {
                splitAble &&
                <>
                    <Collapse in={open} dimension="height">
                        <div id="example-collapse-text">
                            <EnumFilterByKeyValue
                                {...props}
                                translate={true}
                                enumArray={secondHalf}
                                name={props.name}
                                labelPrefix={props.labelPrefix}
                                handleChange={props.handleChange}
                            />
                        </div>
                    </Collapse>

                    <div>
                        <span
                            onClick={() => setOpen(!open)}
                            className="read-or-hide">
                            {!open ? "Show More +" : " Show less -"}
                        </span>
                    </div>
                </>
            }
        </>
    )
}

