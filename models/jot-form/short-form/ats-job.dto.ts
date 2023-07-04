import * as yup from "yup";

export class AtsJobDto {
    applying_for_job: boolean;
    static yupSchema() {
        return yup.object({
            phone: yup.string().required().nullable()
        });
    }
}
