import { OverlayTrigger, Popover } from "react-bootstrap";
import { useTranslation } from "../../hooks/useTranslation";

export default function ShowEnumFromString(props) {
    const { t } = useTranslation();
    if (!props.str) {
        return <></>
    }
    let str = Array.isArray(props.str) ? props.str.toString() : `${props.str}`
    if (!str) {
        return <></>
    }
    const separator = props.separator ? props.separator : ','
    const skipTranslate = props.skipTranslate ? true : false
    const compareEnum = props.compareEnum ? true : false
    const arr = str.split(separator)

    const templateString = arr.map(item => {
        const enumValue = (!compareEnum) ? item : props.enumArray[item]
        return skipTranslate ? enumValue : t((props.labelPrefix ? props.labelPrefix + "." : "") + enumValue)
    }).join(', ')

    const popover = (
        <Popover id="popover-basic">
            {
                props.popover_header &&
                <Popover.Header as="h3">{props.popover_header}</Popover.Header>
            }
            <Popover.Body>
                {templateString}
            </Popover.Body>
        </Popover>
    );

    if (props.popover) {
        return <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={popover}
        >
            <span >{templateString.slice(0, 7)}...</span>
        </OverlayTrigger>
    }
    return templateString
}