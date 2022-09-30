import * as yup from "yup";
import "../../utils/yup";
export class UserPreferredHourDto {
    constructor() { }
    start?: Date;
    end?: Date;

    static yupSchema() {
        return yup.object({
            start: yup.string().required().nullable(),
            end: yup.string().required().nullable(),
        });
    }
}
