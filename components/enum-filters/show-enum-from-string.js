import { OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";

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
    const skipLowerCase = props.skipLowerCase ? true : false
    const arr = str.split(separator)

    const templateString = arr.map(item => {
        const enumValue = !(props.enumArray[item]) ? '' : (skipLowerCase ? props.enumArray[item] : props.enumArray[item].toLowerCase())
        return skipTranslate ? enumValue : t((props.labelPrefix ? props.labelPrefix + "." : "") + enumValue)
    }).join(', ')

    const popover = (
        <Popover id="popover-basic">
            {/* <Popover.Header as="h3">Popover right</Popover.Header> */}
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