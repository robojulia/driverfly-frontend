import * as yup from "yup";
import { InappropriateCompanyFlag } from "../../enums/support/inappropriate-company-flag.enum"


export class FlagInappropriateCompanyDto {
    constructor(companyId) {
        this.companyId = companyId
    }

    companyId: number;
    type: InappropriateCompanyFlag;
    type_other?: string;

    static yupSchema() {
        return yup.object({

            companyId: (yup.number().nullable().required()),
            type: (yup.string() as any).enum(InappropriateCompanyFlag).nullable(),
            type_other: yup.string().when("type", {
                is: v => v == InappropriateCompanyFlag.OTHER,
                then: yup.string().nullable()
            }).nullable(),

        });

    }
}