import { useRef, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import AsyncSelect from 'react-select/async';
import { useTranslation } from '../../hooks/use-translation';

import { ChattableType } from '../../enums/conversation/chattable-type.enum';
import { ApplicantEntity } from '../../models/applicant';
import { EmployeeEntity } from '../../models/employee/employee.entity';
import ApplicantApi from '../../pages/api/applicant';
import EmployeeApi from '../../pages/api/employee';
import { useEffectAsync } from '../../utils/react';

export interface ComboboxProps {
  label?: string;
  name?: string;
  minLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement> | any) => void;
  options?: ComboboxItem[] | ((search: string) => Promise<ComboboxItem[]>);
}
export interface ComboboxItem {
  text: string;
  value: any;
  parts?: string[];
}

const csutomStyles: StylesConfig<ComboboxItem & any> = {
  placeholder: (styles: any, { isFocused }) => ({
    ...styles,
    color: 'black',
    fontWeight: 'lighter',
  }),
  clearIndicator: (styles: any, { isFocused }) => ({
    ...styles,
    color: 'black',
    borderColor: isFocused ? '#2ec8c4' : '#4ca7a8',
  }),
  container: (styles: any, { isFocused }) => ({
    ...styles,
    width: '100%',
    borderColor: isFocused ? '#2ec8c4' : '#4ca7a8',
  }),
  control: (styles: any, { isFocused, menuIsOpen }) => ({
    ...styles,
    backgroundColor: 'white',
    color: 'black',
    borderColor: isFocused || menuIsOpen ? '#2ec8c4' : '#4ca7a8',
  }),
  option: (styles: any, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      zIndex: 9999,
      color:
        isFocused || isSelected
          ? 'white'
          : // : data?.value?.chattable_type == ChattableType.EMPLOYEE
            //     ? '#2ec8c4'
            'black',
      backgroundColor: isFocused ? '#2ec8c4' : isSelected ? '#4ca7a8' : 'white',
    };
  },
};

export default function Combobox(props: ComboboxProps) {
  const { label, name, onChange, ...rest } = props;

  const minLength = props.minLength || 1;

  const { t } = useTranslation();

  const selectInputRef = useRef(null);

  const [options, setOptions] = useState<ComboboxItem[]>([]);

  // Utility function to format phone numbers
  const formatPhoneNumber = (phone: string): string => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const getOptions = async () => {
    const applicantApi = new ApplicantApi();
    const employeeApi = new EmployeeApi();

    const applicants = (
      (await applicantApi.list({
        without: ['jobs', 'equipment_experience', 'applicant_dac', 'applicant_extras'],
        is_paginated: false,
      })) as ApplicantEntity[]
    )?.filter((v) => !!v?.phone);
    const employees = ((await employeeApi.list()) as EmployeeEntity[])?.filter((ap) => !!ap?.phone);

    return [
      ...applicants?.map((v) => ({
        text: `${v.first_name} ${v.last_name}${
          v.phone ? ` ${formatPhoneNumber(v.phone)}` : ''
        } (${t('ChattableType.' + ChattableType.APPLICANT)})`,
        value: {
          chattable_type: Boolean(v.user) ? ChattableType.USER : ChattableType.APPLICANT,
          chattable_id: v.user?.id || v.id,
          chattable_name: v.user?.name || `${v.first_name} ${v.last_name}`,
        },
      })),
      ...employees?.map((v) => ({
        text: `${v.first_name} ${v.last_name}${
          v.phone ? ` ${formatPhoneNumber(v.phone)}` : ''
        } (${t('ChattableType.' + ChattableType.EMPLOYEE)})`,
        value: {
          chattable_type: ChattableType.EMPLOYEE,
          chattable_id: v.id,
          chattable_name: `${v.first_name} ${v.last_name}`,
        },
      })),
    ];
  };
  useEffectAsync(async () => {
    // Use props options if provided, otherwise use hardcoded getOptions
    if (rest?.options) {
      if (typeof rest.options === 'function') {
        // If options is a function, it's for dynamic search - don't load initially
        setOptions([]);
      } else {
        // If options is an array, use it directly
        setOptions(rest.options);
      }
    } else {
      // Use hardcoded getOptions for backward compatibility
      setOptions(await getOptions());
    }
  }, [rest?.options]);

  const onOptionClick = (e: { value: any }, _actionMeta: any): void => {
    if (onChange) {
      onChange({
        target: {
          name: name,
          value: e?.value,
        },
      });
    }
  };

  // Async search function for when options is a function
  const loadOptions = async (inputValue: string) => {
    if (!inputValue || inputValue.length < minLength) {
      return [];
    }

    if (typeof rest?.options === 'function') {
      try {
        const searchResults = await rest.options(inputValue);
        return searchResults?.map((v) => ({ value: v.value, label: v.text })) || [];
      } catch (error) {
        console.error('Error loading options:', error);
        return [];
      }
    }

    return [];
  };

  // Check if we should use async select or regular select
  const useAsyncSelect = typeof rest?.options === 'function';

  return (
    <>
      {label && <label htmlFor={name}>{t(label)}</label>}

      {useAsyncSelect ? (
        <AsyncSelect
          ref={selectInputRef}
          styles={csutomStyles}
          className="basic-single"
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          loadOptions={loadOptions}
          onChange={onOptionClick}
          placeholder="Select..."
          noOptionsMessage={({ inputValue }) =>
            inputValue.length < minLength
              ? `Type at least ${minLength} characters to search`
              : 'No options found'
          }
        />
      ) : (
        <Select
          ref={selectInputRef}
          styles={csutomStyles}
          className="basic-single"
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          options={options?.map((v) => ({ value: v.value, label: v.text }))}
          onChange={onOptionClick}
        />
      )}
    </>
  );
}
