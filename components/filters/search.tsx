import { KeyboardEvent, ChangeEvent, useState, useEffect, KeyboardEventHandler, useRef } from "react";
import { AsyncTypeahead, Highlighter, Menu, MenuItem } from "react-bootstrap-typeahead";
import { RenderMenuProps } from "react-bootstrap-typeahead/types/components/Typeahead";
import { Option, TypeaheadManagerChildProps } from "react-bootstrap-typeahead/types/types";
import { useTranslation } from "../../hooks/useTranslation";
import JobApi from "../../pages/api/job";

type Title = {
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
        if (code === 'Enter') {
            setClose()
            if (searchQuery != value) setSearchQuery(value)
        }
    }

    const inputChangeHandler = (query: string): void => {
        setOpen()
        searchHandler(query)
    }

    const optionChangehandler = (values: Title[]) => values.map(({ title }) => setSearchQuery(title))

    const focusBlurHandler = ({ target: { value } }: any) => {
        setClose()

        if (searchQuery != value) setSearchQuery(value)
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
                <MenuItem option={result} position={index}>
                    <Highlighter search={state.text}>{result.title}</Highlighter>
                </MenuItem>
            ))}
        </Menu>
    )

    useEffect(() => {

        setFiltersByKeyValue('keywords', searchQuery)

        if (!!!searchQuery) typeaheadRef.current.clear()

    }, [searchQuery])

    return (
        <>
            <label className={labelClassName || "heading-label my-4"}>{label || t('SEARCH_KEYWORD')} </label>
            {/* <small className='ml-1 mt-2 form-text get_result_text'>{t("GET_RESULTS")}</small>  */}
            <AsyncTypeahead
                ref={typeaheadRef}
                // {/* className={props.inputClassName || "form-control shadow-sm p-4"} */}
                defaultInputValue={filters.keywords || searchQuery || ""}
                open={!!isOpen}
                isLoading={isLoading}
                labelKey="title"
                minLength={0}
                onFocus={focusBlurHandler}
                onBlur={focusBlurHandler}
                onChange={optionChangehandler}
                onInputChange={inputChangeHandler}
                onKeyDown={keyDownHandler}
                onSearch={inputChangeHandler}
                options={options}
                placeholder={t("KEYWORD_PLACEHOLDER")}
                renderMenu={renderMenu}
            />
            <small className='ml-1 mt-2 form-text get_result_text'>{t("GET_RESULTS")}</small>
        </>
    )
}