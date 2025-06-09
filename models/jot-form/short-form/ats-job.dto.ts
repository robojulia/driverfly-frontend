import * as yup from 'yup';

export class AtsJobDto {
  applying_for_job: boolean = false;
  jobId?: number;

  static yupSchema() {
    return yup.object({
      applying_for_job: yup.boolean().nullable(),
    });
  }
}
