import * as yup from "yup";

export class AccidentLastFiveYearsDto {
  accidents_within_last_5_years: number;
  date_of_accident_1: string | Date;
  date_of_accident_2: string | Date;
  date_of_accident_3: string | Date;
  nature_of_accident_1: string;
  nature_of_accident_2: string;
  nature_of_accident_3: string;
  location_of_accident_1: string;
  location_of_accident_2: string;
  location_of_accident_3: string;
  number_of_fatalaties_1: number;
  number_of_fatalaties_2: number;
  number_of_fatalaties_3: number;
  number_of_injured_1: number;
  number_of_injured_2: number;
  number_of_injured_3: number;
  dot_recordable_1: boolean = false;
  dot_recordable_2: boolean = false;
  dot_recordable_3: boolean = false;
  at_fault_1: boolean = false;
  at_fault_2: boolean = false;
  at_fault_3: boolean = false;

  static yupSchema() {
    return yup.object({
      accidents_within_last_5_years: yup.number().nullable(),
      date_of_accident_1: yup.date().nullable(),
      date_of_accident_2: yup.date().nullable(),
      date_of_accident_3: yup.date().nullable(),
      nature_of_accident_1: yup.string().nullable(),
      nature_of_accident_2: yup.string().nullable(),
      nature_of_accident_3: yup.string().nullable(),
      location_of_accident_1: yup.string().nullable(),
      location_of_accident_2: yup.string().nullable(),
      location_of_accident_3: yup.string().nullable(),
      number_of_fatalaties_1: yup.number().nullable(),
      number_of_fatalaties_2: yup.number().nullable(),
      number_of_fatalaties_3: yup.number().nullable(),
      number_of_injured_1: yup.number().nullable(),
      number_of_injured_2: yup.number().nullable(),
      number_of_injured_3: yup.number().nullable(),
      dot_recordable_1: yup.boolean().default(false),
      dot_recordable_2: yup.boolean().default(false),
      dot_recordable_3: yup.boolean().default(false),
      at_fault_1: yup.boolean().default(false),
      at_fault_2: yup.boolean().default(false),
      at_fault_3: yup.boolean().default(false),
    });
  }
}
