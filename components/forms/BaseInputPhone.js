import React from 'react'
import { useTranslation } from '../../hooks/useTranslation';

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import es from 'react-phone-input-2/lang/es.json'

function BaseInputPhone({ required, className, label, handleBlur, placeholder, value, onChange, onKeyDown, name, error, }) {
  const { t } = useTranslation();

  return (
    <div className={className}>
      {label && <><label>{t(label)}{required ? "*" : ""}:</label><br /></>}
      <PhoneInput
        onlyCountries={['us']}
        isValid={error ? false : true}
        inputProps={{
          name: { name },
        }}
        defaultErrorMessage={error}
        country={'us'}
        placeholder={t(placeholder)}
        value={value || ""}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={handleBlur}
      />
      {error && (typeof error === "string") ? <span className="text-danger small">{error}</span> : null}
    </div>
  )
}

export default BaseInputPhone