import * as yup from "yup";
import { ApplicantOnBoardingChecklist } from '../../enums/applicants/applicant-onboarding-checklist.enum';
import { CompanyPreferenceCategory } from "../../enums/company/company-preference-category.enum";
import { CompanyPreferenceEnhancementLabel } from '../../enums/company/company-preference-enhancement-label.enum';
import { CompanyPreferenceJotformLabel } from "../../enums/company/company-preferences-jotform-label.enum";
import { CompanyPreferenceOnboardingChecklistLabel } from '../../enums/company/company-preferences-onboarding-checklist-label.enum';
import { JobEmploymentType } from "../../enums/jobs/job-employment-type.enum";
import { JobGeography } from "../../enums/jobs/job-geography.enum";
import { DriverLicenseType } from "../../enums/users/driver-license-type.enum";
import "../../utils/yup";
import { CompanyPreferenceAutoRecrutingLabel } from './../../enums/company/company-preferences-auto-recruiting-label.enum';
import { CompanyEntity } from "./company.entity";

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
                    then: (yup.string().required().nullable() as any).enum(CompanyPreferenceJotformLabel)
                }),

            value: yup.mixed()
                .when("category", {
                    is: CompanyPreferenceCategory.JOTFORM,
                    then: yup.mixed()
                        .when("label", {
                            is: CompanyPreferenceJotformLabel.CDL_CLASS,
                            then: yup.array((yup.string() as any).required().enum(DriverLicenseType)).nullable()
                        })
                        .when("label", {
                            is: CompanyPreferenceJotformLabel.DRUG_TEST_PASS,
                            then: yup.bool().required().default(false)
                        })
                        .when("label", {
                            is: CompanyPreferenceJotformLabel.OWNER_OPERATOR,
                            then: yup.bool().required().default(false)
                        })
                        .when("label", {
                            is: CompanyPreferenceJotformLabel.MAXIMUM_ACCIDENTS,
                            then: yup.number().min(0).required().nullable()
                        })
                        .when("label", {
                            is: CompanyPreferenceJotformLabel.MAXIMUM_MOVING_VIOLATIONS,
                            then: yup.number().min(0).required().nullable()
                        })
                        .when("label", {
                            is: CompanyPreferenceJotformLabel.YEARS_CDL_EXPERIENCE,
                            then: yup.number().min(0).required().nullable()
                        })
                        .when("label", {
                            is: CompanyPreferenceJotformLabel.EMPLOYMENT_TYPE,
                            then: yup.array((yup.string() as any).required().enum(JobEmploymentType)).nullable()
                        })
                        .when("label", {
                            is: CompanyPreferenceJotformLabel.JOB_GEOGRAPHY,
                            then: yup.array((yup.string() as any).required().enum(JobGeography)).nullable()
                        })
                })
                .when("category", {
                    is: CompanyPreferenceCategory.ENHANCEMENT,
                    then: yup.mixed()
                        .when("label", {
                            is: CompanyPreferenceEnhancementLabel.ADD_SSN_ON_DHA,
                            then: yup.boolean().optional().nullable()
                        })
                        .when("label", {
                            is: CompanyPreferenceEnhancementLabel.SSN_REQUIRED,
                            then: yup.boolean().optional().nullable()
                        })
                })
                .when("category", {
                    is: CompanyPreferenceCategory.ONBOARDING_CHECKLIST,
                    then: yup.mixed()
                        .when("label", {
                            is: CompanyPreferenceOnboardingChecklistLabel.APPLICANT_DOCUMETS,
                            then: yup.array((yup.string() as any).required().enum(ApplicantOnBoardingChecklist)).nullable()
                        })
                        .when("label", {
                            is: CompanyPreferenceOnboardingChecklistLabel.APPLICANT_DAC,
                            then: yup.array()
                                .of(yup.string().required())
                                .test(
                                    'unique',
                                    'Items in the array must be unique',
                                    (value) => Array.isArray(value) && new Set(value).size === value.length
                                )
                                .nullable(),
                        })
                        .when("label", {
                            is: CompanyPreferenceOnboardingChecklistLabel.EMPLOYEE_HR_FILES,
                            then: yup.array()
                                .of(yup.string().required())
                                .test(
                                    'unique',
                                    'Items in the array must be unique',
                                    (value) => Array.isArray(value) && new Set(value).size === value.length
                                )
                                .nullable(),
                        })
                })
                .when("category", {
                    is: CompanyPreferenceCategory.DQF,
                    then: yup.mixed()
                        .when("label", {
                            is: CompanyPreferenceOnboardingChecklistLabel.EMPLOYEE_DQF_DOCUMENTS,
                            then: yup.array()
                                .of(yup.string().required())
                                .test(
                                    'unique',
                                    'Items in the array must be unique',
                                    (value) => Array.isArray(value) && new Set(value).size === value.length
                                )
                                .nullable(),
                        })
                })
        });
    }

    static autoRecruitingYupScehma() {
        return yup.object({
            category: (yup.string().optional().nullable() as any).enum(CompanyPreferenceCategory),
            label: yup.string().optional().nullable()
                .when("category", {
                    is: CompanyPreferenceCategory.AUTO_RECRUITING,
                    then: (yup.string().required().nullable() as any).enum(CompanyPreferenceJotformLabel)
                }),
            value: yup.mixed()
                .when("category", {
                    is: CompanyPreferenceCategory.AUTO_RECRUITING,
                    then: yup.mixed()
                        .when("label", {
                            is: CompanyPreferenceAutoRecrutingLabel.ENROLL_IN_AUTO_RECRUITING,
                            then: yup.boolean().optional().nullable()
                        })
                })
        })
    }
}
