import { useState, useEffect, useRef } from "react";
import { AsyncTypeahead, Highlighter, Menu, MenuItem } from "react-bootstrap-typeahead";
import { RenderMenuProps } from "react-bootstrap-typeahead/types/components/Typeahead";
import { Option, TypeaheadManagerChildProps } from "react-bootstrap-typeahead/types/types";
import { useTranslation } from "../../hooks/use-translation";
import JobApi from "../../pages/api/job";

export type Title = {
    id?: number;
    title: string;
}

export default function Search(props) {

    const {
        state: { filters, searchQuery },
        method: { setFiltersByKeyValue, setSearchQuery },
        labelClassName,
        label,
    } = props
    const { t } = useTranslation()
    const jobApi = new JobApi()
    const typeaheadRef = useRef(null)

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const setOpen = () => setIsOpen(true)
    const setClose = () => setIsOpen(false)

    const [options, setOptions] = useState<Title[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const keyDownHandler = ({ target: { value }, code }: any) => {
        if (code == 'Enter') {
            setClose()
            if (searchQuery != value) setSearchQuery(value)
        }
    }

    const inputChangeHandler = (query: string): void => {
        setOpen()
        searchHandler(query)
    }

    const optionChangehandler = (values: Title[]) => values.map(({ title }) => setSearchQuery(title))

    const generalEventHandler = ({ target: { value, innerText } }: any) => {
        setClose()

        if (innerText) setSearchQuery(innerText)
        else if (searchQuery != value) setSearchQuery(value)
    }

    const searchHandler = async (query: string): Promise<void> => {
        try {
            setIsLoading(true)
            const results = await jobApi.keywordSearchQuery(query)
            setOptions(results || [])
            setIsLoading(false)
        } catch (error) {
            console.error("exception.......", error)
        }
    }

    const renderMenu = (
        results: Option[],
        menuProps: RenderMenuProps,
        state: TypeaheadManagerChildProps
    ): JSX.Element => (
        <Menu {...menuProps}>
            {results.map((result: Title, index) => (
                <MenuItem key={index} onClick={generalEventHandler} option={result} position={index}>
                    <Highlighter search={state.text}>{result.title}</Highlighter>
                </MenuItem>
            ))}
        </Menu>
    )

    useEffect(() => {

        setFiltersByKeyValue('keywords', searchQuery)

        if (!!!searchQuery) typeaheadRef.current.clear()

        setClose()
        setIsLoading(false);
    }, [searchQuery])

    return (
        <>
            <label className={labelClassName || "heading-label my-4"}>{label || t('SEARCH_KEYWORD')} </label>
            <AsyncTypeahead
                ref={typeaheadRef}
                defaultInputValue={filters.keywords || searchQuery || ""}
                id="keywords-typeahead"
                open={!!isOpen}
                isLoading={isLoading}
                labelKey="title"
                minLength={0}
                onFocus={generalEventHandler}
                onBlur={generalEventHandler}
                onChange={optionChangehandler}
                onInputChange={inputChangeHandler}
                onKeyDown={keyDownHandler}
                onSearch={inputChangeHandler}
                options={options}
                placeholder={t("KEYWORD_PLACEHOLDER")}
                renderMenu={renderMenu}
            />
        </>
    )
}