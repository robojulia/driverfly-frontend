import BaseSelect, { BaseSelectProps } from './base-select';
import stateList from '../../utils/stateList';

export default function StateSelect(props: BaseSelectProps) {
  return <BaseSelect {...props} options={stateList} valueKey="value" labelKey="label" />;
}
