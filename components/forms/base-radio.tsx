import React from 'react'
import { useTranslation } from '../../hooks/use-translation';
import { BaseControlProps } from './base-control';

export interface BaseCheckProps extends BaseControlProps {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  disabled?: boolean;
  options?: any[];
}

export default function BaseRadio({ formik, required, className, label, checked, onChange, handleBlur, readOnly, name, touched, error, disabled, options }: BaseCheckProps) {
  const { t } = useTranslation();

//   if (formik) {
//     const meta = formik.getFieldMeta(name);

//     if (meta) {
//       checked = meta.value === true;
//       touched = meta.touched;
//       error = meta.error;
//     }
//     onChange = onChange || formik.handleChange
//     handleBlur = handleBlur || formik.handleBlur;
//   }

  /**
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e 
   */
//   const onChangeProxy = (e) => {
//     const { checked } = e.target;
//     console.log(e,"========================>>>>>>>>>>>>>>>>>>", checked);
//       onChange({
//         ...e,
//         target: {
//           ...e.target,
//           name: name,
//           value: checked
//         }
//       });
//   };

const changeTarget = (e) =>{
    const { checked } = e.target;
    console.log(e,"-------------------------+++++++++++++++++++++++",e.target.name,"===================================",checked);

    formik.setFieldValue(e.target.name , checked);
}


  return (
    <div className={className}>
    {label && <label htmlFor={name} style={{ marginLeft: ".5em" }} className="form-check-label">{t(label)}{required ? <span className='text-danger'>*</span> : ""}</label>}
      <div className='form-radio '>
        {
            options &&
             options.map((itm, index) => {
                return<>
                  <label className='mr-4 '>{Object.keys(options[index])}</label>
                    <input
                    disabled={disabled}
                    id={name}
                    type="radio"
                    // checked={checked}
                    onChange={()=>changeTarget}
                    // value={Object.values(options[index])}
                    readOnly={readOnly}
                    name={name}
                    role="switch"
                    className={`form-check-input ${error ? "is-invalid" : ""}`}
                    />
                </>
            })
        }

      </div>
      {touched && error && (typeof error === "string") ? <span className="text-danger small">{t(error)}</span> : null}
    </div>
  )
}