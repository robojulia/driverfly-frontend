import { useState } from "react";
import { Button, Dropdown, FormControl } from "react-bootstrap";
import { useTranslation } from "../../hooks/useTranslation";

import style from "../../public/components/styles/css/ComboBox.module.css";


export interface ComboboxProps {
    label?: string;
    name?: string;
    minLength?: number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>|any) => void;
    options?: ComboboxItem[]|((search: string) => Promise<ComboboxItem[]>);
}

export interface ComboboxItem {
    text: string;
    value: any;
    parts?: string[]
}

export default function Combobox(props: ComboboxProps) {
    const { label, name, options, onChange } = props;

    const minLength = props.minLength || 1;

    const { t } = useTranslation();

    const [ state, setState ] = useState({
        value: "",
        query: "",
        show: false,
        options: []
    });

    const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        const query = value?.toLowerCase() || "";

        if (query.length >= minLength) {
            let opts = typeof options === "function"  ? options(query) : options;

            if (opts instanceof Promise) opts = await opts;

            setState({
                ...state,
                query: query,
                show: true,
                value: null,
                options: opts
                    ?.map(o => {
                        const { text, value } = o;

                        const textStart = text.toLowerCase().indexOf( query );
                        const textEnd = textStart + query.length;

                        if (textStart < 0) return null;

                        return {
                            text,
                            value,
                            parts: [text.substring(0, textStart), text.substring(textStart, textEnd), text.substring(textEnd) ]
                        };
                    }).filter(o => !!o) || []
            });
        }
        else {
            if (state.value && onChange) {
                onChange({
                    target: {
                        name: name,
                        value: null
                    }
                })
            }
            setState({
                ...state,
                show: false,
                query: query,
                value: null,
                options: []
            });
        }
    };

    /**
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e 
     */
    const onInputBlur = (e) => {
        const { value } = e.target;

        if (onChange) {
        }
        // setState({
        //     ...state,
        //     show: false,
        // });
    };

    /**
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e 
     */
     const onInputFocus = (e) => {
        const { value } = e.target;

        setState({
            ...state,
            show: !state.value && state.query?.length >= minLength,
        });
    };

    const onOptionClick = (e: React.MouseEvent<HTMLAnchorElement>, value: any) => {
        e.preventDefault();

        const { innerText } = e.currentTarget;

        setState({
            ...state,
            query: innerText,
            value: value,
            show: false,
            options: [],
        });

        if (onChange) {
            onChange({
                target: {
                    name: name,
                    value: value
                }
            })
        }
    };

    return (
        <>
        {label && <label htmlFor={name}>{t(label)}</label>}
        <Dropdown className={style.form_combobox} show={state.show}>
            <FormControl name={name} onChange={onInputChange} onFocus={onInputFocus} onBlur={onInputBlur} type="text" placeholder={t(minLength > 1 ? "TYPE_AT_LEAST_{num}_CHARACTERS_TO_SEE_OPTIONS" : "START_TYPING_TO_SEE_OPTIONS", { num: minLength.toString() })} value={state.query} autoComplete="off" />
            <Dropdown.Menu className="w-100">
                {state.options.length === 0 && <span className="text-warning small">{t("NO_MATCHING_RESULTS")}</span>}
                {state.options.map((o, i) => 
                    (o && <a key={i} href="#" className={`dropdown-item ${style.form_combobox_item}`} onClick={e => onOptionClick(e, o.value)}>
                        {o.parts[0]}<em>{o.parts[1]}</em>{o.parts[2]}
                    </a>)
                )}
            </Dropdown.Menu>
        </Dropdown>
        </>
    );
}

/*
<form style="width:500px; margin:50px auto;">

  <label>Type Alpha</label> 
  <div class="dropdown">
    <input type="text" class="jAuto form-control" 
           placeholder="Type the word Alpha" autocomplete="off">
    <div class="dropdown-menu">
        <i class="hasNoResults">No matching results</i>
        <div class="list-autocomplete">
            <button type="button" class="dropdown-item">01 - Alpha  Barbuda</button>
            <button type="button" class="dropdown-item">02 - Charlie Alpha</button>
            <button type="button" class="dropdown-item">03 - Bravo Alpha</button>
            <button type="button" class="dropdown-item">04 - Delta</button>
        </div>
        <button type="button" class="btn-extra">Custom button</button>
    </div>
  </div>  

  <small style="margin-top:30px">This will search the text of a list placed inside Bootstrap dropdown: also works with copy/paste. <em>Note</em>: Only use this on short lists; it is not a replacement for typeahead.js, which is built for more complex server interactions. Tested in ie9+ and in production environment with 1m users.</small>
</form>


function createAuto (i, elem) {

    var input = $(elem);
    var dropdown = input.closest('.dropdown');
    var listContainer = dropdown.find('.list-autocomplete');
    var listItems = listContainer.find('.dropdown-item');
    var hasNoResults = dropdown.find('.hasNoResults');

    listItems.hide();
    listItems.each(function() {
         $(this).data('value', $(this).text() );  
         //!important, keep this copy of the text outside of keyup/input function
    });
    
    input.on("input", function(e){
        
        if((e.keyCode ? e.keyCode : e.which) == 13)  {
            $(this).closest('.dropdown').removeClass('open').removeClass('in');
            return; //if enter key, close dropdown and stop
        }
        if((e.keyCode ? e.keyCode : e.which) == 9) {
            return; //if tab key, stop
        }

      
        var query = input.val().toLowerCase();

        if( query.length > 1) {

            dropdown.addClass('open').addClass('in');

            listItems.each(function() {
             
              var text = $(this).data('value');             
              if ( text.toLowerCase().indexOf(query) > -1 ) {
 
                var textStart = text.toLowerCase().indexOf( query );
                var textEnd = textStart + query.length;
                var htmlR = text.substring(0,textStart) + '<em>' + text.substring(textStart,textEnd) + '</em>' + text.substring(textEnd+length);
                $(this).html( htmlR );               
                $(this).show();
 
              } else { 
              
                $(this).hide(); 
              
              }
            });
          
            var count = listItems.filter(':visible').length;
            ( count > 0 ) ? hasNoResults.hide() : hasNoResults.show();

        } else {
            listItems.hide();
            dropdown.removeClass('open').removeClass('in');
            hasNoResults.show();
        }
    });

  	listItems.on('click', function(e) {
        var txt = $(this).text().replace(/^\s+|\s+$/g, "");  //remove leading and trailing whitespace
        input.val( txt );
        dropdown.removeClass('open').removeClass('in');
		});

}

$('.jAuto').each( createAuto );


$(document).on('focus', '.jAuto', function() {
     $(this).select();  // in case input text already exists
});
  
*/