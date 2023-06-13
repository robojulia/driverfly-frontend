import * as yup from "yup";

export class RefisteredAccidentDetailsDto {
  date: string;
  location: string;
  number_of_injuries: string;
  number_of_fatalities: string;
  number_of_hazmat_spills: string;

  static yupSchema() {
    return yup.object({
      date: yup.string().optional().nullable(),
      location: yup.string().optional().nullable(),
      number_of_injuries: yup.string().optional().nullable(),
      number_of_fatalities: yup.string().optional().nullable(),
      number_of_hazmat_spills: yup.string().optional().nullable(),
    });
  }
}
