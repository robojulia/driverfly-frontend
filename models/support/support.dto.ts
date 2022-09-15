
import * as yup from "yup";

export class SupportDto {
    bug: string;
    operating_system: string;
    page_path_url: string;

    static yupSchema() {
        return yup.object({
            bug: yup.string().required().nullable(),
            operating_system: yup.string().required().nullable(),
            page_path_url: yup.string().required().nullable(),

        });
    }
}
