import * as yup from "yup";

export class AccidentLastFiveYearsDto {
    accidents_within_last_5_years: null;
    date_of_accident_1: null;
    date_of_accident_2: null;
    date_of_accident_3: null;
    nature_of_accident_1: null;
    nature_of_accident_2: null;
    nature_of_accident_3: null;
    location_of_accident_1: null;
    location_of_accident_2: null;
    location_of_accident_3: null;
    number_of_fatalaties_1: null;
    number_of_fatalaties_2: null;
    number_of_fatalaties_3: null;
    number_of_injured_1: null;
    number_of_injured_2: null;
    number_of_injured_3: null;
    dot_recordable_1: false;
    dot_recordable_2: false;
    dot_recordable_3: false;
    at_fault_1: false;
    at_fault_2: false;
    at_fault_3: false;

  static yupSchema() {
    return yup.object({
    //   first_name: yup
    //     .string()
    //     .matches(/^[A-Za-z ]*$/, "Please enter valid name")
    //     .required()
    //     .nullable(),
    //   last_name: yup
    //     .string()
    //     .matches(/^[A-Za-z ]*$/, "Please enter valid name")
    //     .required()
    //     .nullable(),
    });
  }
}
