import { CompanyPreferenceCategory } from "../../enums/company/company-preference-category.enum";
import * as yup from "yup";
import "../../utils/yup";
import { CompanyEntity } from "./company.entity";
import { CompanyPreferenceLabel } from "../../enums/company/company-preferences-jotform-label.enum";

export class CompanyPreferenceEntity {
    constructor() { }
    id?: number;
    company?: CompanyEntity;
    category?: CompanyPreferenceCategory;
    label?: string;
    value?: any;

    static yupSchema() {
        return yup.object({
            category: (yup.string().optional().nullable() as any).enum(CompanyPreferenceCategory),
            label: yup.string().optional().nullable()
                .when("category", {
                    is: CompanyPreferenceCategory.JOTFORM,
                    then: (yup.string().required().nullable() as any).enum(CompanyPreferenceLabel)
                }),

            value: yup.mixed()
                .when("category", {
                    is: CompanyPreferenceCategory.JOTFORM,
                    then: yup.mixed()
                        // .when("label", {
                        //     is: CompanyPreferenceLabel.CDL_CLASS,
                        //     then: yup.bool().required().default(false)
                        // }),
                        .when("label", {
                            is: CompanyPreferenceLabel.CDL_CLASS,
                            then: yup.string().required().nullable()
                        })
                })
        });
    }
}
