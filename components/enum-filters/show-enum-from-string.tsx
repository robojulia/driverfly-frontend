import { OverlayTrigger, Popover } from "react-bootstrap";
import { useTranslation } from "../../hooks/use-translation";
import { ShowEnumFromStringProps } from "../../types/components/show-enum-from-string-props.type";

export default function ShowEnumFromString(props: ShowEnumFromStringProps): JSX.Element {

    let {
        value,
        separator,
        skipTranslate,
        compareEnum,
        enumArray,
        labelPrefix,
        popover_header,
        popover,
        placement,
    } = props

    const { t } = useTranslation();

    if (value == null) return (<>{t("NOT_AVAILABLE")}</>);

    separator = separator ?? ','
    value = (Array.isArray(value) ? value.toString() : `${value}`).split(separator)

    const templateString = value.map(item => {
        const enumValue = (!compareEnum) ? item : enumArray[item]
        return skipTranslate ? enumValue : t((labelPrefix ? labelPrefix + "." : "") + enumValue)
    }).join(', ')

    const overlay = (
        <Popover id="popover-basic">
            {
                popover_header &&
                <Popover.Header as="h3">{popover_header}</Popover.Header>
            }
            <Popover.Body>
                {templateString}
            </Popover.Body>
        </Popover>
    );

    return (
        popover
            ? <OverlayTrigger
                placement={placement ?? "bottom-start"}
                delay={{ show: 250, hide: 400 }}
                overlay={overlay}
            >
                <span >{templateString}</span>
            </OverlayTrigger >
            : <>{templateString}</>
    )
}