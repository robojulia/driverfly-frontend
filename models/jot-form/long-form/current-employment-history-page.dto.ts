import * as yup from "yup";
import { CurrentEmploymentHistoryDto } from "./current-emplyment-history/index.dto";

export class CurrentEmploymentHistoryPageDto {
    is_current_employed: boolean;
    employer: CurrentEmploymentHistoryDto;

    static yupSchema() {
        return yup.object({
            is_current_employed: yup.boolean().optional().nullable(),
            employer: yup.object().when("is_current_employed", {
                is: v => !!v,
                then: CurrentEmploymentHistoryDto.derivedYupSchema()
            }).nullable()
        });
    }
}
