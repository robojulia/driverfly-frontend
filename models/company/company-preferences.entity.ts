import { CompanyPreferenceCategory } from "../../enums/company/company-preference-category.enum";
import * as yup from "yup";
import "../../utils/yup";
import { CompanyEntity } from "./company.entity";
import { DriverLicenseType } from "../../enums/users/driver-license-type.enum";
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
                        .when("label", {
                            is: CompanyPreferenceLabel.CDL_CLASS,
                            then: yup.array((yup.string() as any).required().enum(DriverLicenseType)).nullable()
                        })
                        .when("label", {
                            is: CompanyPreferenceLabel.DRUG_TEST_PASS,
                            then: yup.bool().required().default(false)
                        })
                        .when("label", {
                            is: CompanyPreferenceLabel.OWNER_OPERATOR,
                            then: yup.bool().required().default(false)
                        })
                        .when("label", {
                            is: CompanyPreferenceLabel.MINIMUM_ACCIDENTS,
                            then: yup.number().min(0).required().nullable()
                        })
                        .when("label", {
                            is: CompanyPreferenceLabel.MIN_MOVING_VIOLATIONS,
                            then: yup.number().min(0).required().nullable()
                        })
                        .when("label", {
                            is: CompanyPreferenceLabel.YEARS_CDL_EXPERIENCE,
                            then: yup.number().min(0).required().nullable()
                        })
                })
        });
    }
}
