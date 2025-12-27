import BaseSelect, { BaseSelectProps } from './base-select';
import stateList from '../../utils/stateList';
import provinceList from '../../utils/provinceList';
import mexicoStateList from '../../utils/mexicoStateList';

interface CountryStateSelectProps extends BaseSelectProps {
  country?: string;
}

export default function CountryStateSelect({ country, ...props }: CountryStateSelectProps) {
  // Determine which list to use based on the country
  let options = stateList;
  let label = 'State';

  if (country === 'Canada') {
    options = provinceList;
    label = 'Province';
  } else if (country === 'Mexico') {
    options = mexicoStateList;
    label = 'State';
  } else {
    // Default to US states
    options = stateList;
    label = 'State';
  }

  return (
    <BaseSelect
      {...props}
      label={props.label || label}
      options={options}
      valueKey="value"
      labelKey="label"
    />
  );
}
