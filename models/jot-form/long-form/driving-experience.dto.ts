import moment from 'moment';
import * as yup from 'yup';
import stateList from '../../../utils/stateList';

export class DrivingExperienceDto {
  license_number: string;
  license_expiry: string | Date;
  license_state: string;

  static yupSchema() {
    return yup.object({
      license_expiry: yup
        .date()
        .typeError('INVALID_DATE')
        .test('is-expired', 'LICENSE_HAS_EXPIRED', (value) =>
          moment(value).isAfter(moment().startOf('day'))
        )
        .min(moment().endOf('day'), 'LICENSE_MUST_BE_VALID_AFTER_TODAY'),
      license_state: yup
        .string()
        .required()
        .oneOf(stateList.map((state) => state.value))
        .nullable(),
      license_number: yup
        .string()
        // .when("license_state", {
        //   is: (value) => value == "AL",
        //   then: yup.string().max(8),
        // })
        .required()
        .nullable(),
    });
  }
}
