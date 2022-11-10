import * as yup from "yup";
import "../../../../utils/yup";

export class AccidentHistoryEntity {
    date_of_accident?: string | Date;
    nature_of_accident?: string;
    number_of_injured?: number;
    location_of_accident?: string;
    number_of_fatalaties?: number;
    dot_recordable?: boolean = false;
    at_fault?: boolean = false;

    static yupSchema() {
        return yup.object({
            date_of_accident: yup.date().required().nullable(),
            nature_of_accident: yup.string().required().nullable(),
            location_of_accident: yup.string().required().nullable(),
            number_of_fatalaties: yup.number().required().nullable(),
            number_of_injured: yup.number().required().nullable(),
            dot_recordable: yup.boolean().default(false),
            at_fault: yup.boolean().default(false),
        });
    }

}
