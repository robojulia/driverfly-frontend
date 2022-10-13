import { UserPreferenceCategory } from "../../enums/users/user-preference-category.enum";
import { UserEntity } from "./user.entity";
import * as yup from "yup";
import "../../utils/yup";
import { UserPreferenceCommunicationLabel } from "../../enums/users/user-preferences-communication-label.enum";
import { CommunicationMethod } from "../../enums/users/communication-method.enum";
import { UserPreferenceSharingLabel } from "../../enums/users/user-preference-sharing-label.enum";
import { SharePreference } from "../../enums/users/share-preference.enum";
import { UserPreferenceMatchingLabel } from "../../enums/users/user-preference-matching-label.enum";
import { JobGeography } from "../../enums/jobs/job-geography.enum";
import { JobSchedule } from "../../enums/jobs/job-schedule.enum";
import { JobEmploymentType } from "../../enums/jobs/job-employment-type.enum";
import { JobTeamDriver } from "../../enums/jobs/job-team-driver.enum";
import { JobPayMethod } from "../../enums/jobs/job-pay-method.enum";
import { JobBenefits } from "../../enums/jobs/job-benefits.enum";
import { UserPreferredHourDto } from "./user-preferred-hour.dto";

export class UserPreferenceEntity {
    constructor() { }
    id?: number;
    user?: UserEntity;
    category?: UserPreferenceCategory;
    label?: string;
    value?: any;

    static yupSchema() {
        return yup.object({
            category: (yup.string().required().nullable() as any).enum(UserPreferenceCategory),
            label: yup.string().required().nullable()
                // each category has a different enum
                .when("category", {
                    is: UserPreferenceCategory.COMMUNICATION,
                    then: (yup.string().required().nullable() as any).enum(UserPreferenceCommunicationLabel)
                })
                .when("category", {
                    is: UserPreferenceCategory.SHARING,
                    then: (yup.string().required().nullable() as any).enum(UserPreferenceSharingLabel)
                })
                .when("category", {
                    is: UserPreferenceCategory.MATCHING,
                    then: (yup.string().required().nullable() as any).enum(UserPreferenceMatchingLabel)
                }),
            value: yup.mixed()
                // each label has a different type
                .when("category", {
                    is: UserPreferenceCategory.COMMUNICATION,
                    then: yup.mixed()
                        .when("label", {
                            is: UserPreferenceCommunicationLabel.RECEIVE_DRIVERFLY,
                            then: yup.bool().required().default(false)
                        })
                        .when("label", {
                            is: UserPreferenceCommunicationLabel.RECEIVE_SUGGESTED_JOBS,
                            then: yup.bool().required().default(false)
                        })
                        .when("label", {
                            is: UserPreferenceCommunicationLabel.RECEIVE_NEWSLETTER,
                            then: yup.bool().required().default(false)
                        })
                        .when("label", {
                            is: UserPreferenceCommunicationLabel.PREFERRED_METHOD,
                            then: yup.array((yup.string() as any).enum(CommunicationMethod)).required().nullable()
                        })
                        .when("label", {
                            is: UserPreferenceCommunicationLabel.PREFERRED_HOURS,
                            then: UserPreferredHourDto.yupSchema().nullable()
                        })
                })
                .when("category", {
                    is: UserPreferenceCategory.SHARING,
                    then: (yup.string().required() as any).enum(SharePreference)
                })
                .when("category", {
                    is: UserPreferenceCategory.MATCHING,
                    then: yup.mixed()
                        .when("label", {
                            is: UserPreferenceMatchingLabel.GEOGRAPHY,
                            then: yup.array((yup.string() as any).enum(JobGeography)).nullable()
                        })
                        .when("label", {
                            is: UserPreferenceMatchingLabel.SCHEDULE,
                            then: yup.array((yup.string() as any).enum(JobSchedule)).nullable()
                        })
                        .when("label", {
                            is: UserPreferenceMatchingLabel.EMPLOYMENT_TYPE,
                            then: yup.array((yup.string() as any).enum(JobEmploymentType)).nullable()
                        })
                        .when("label", {
                            is: UserPreferenceMatchingLabel.TEAM_DRIVERS,
                            then: yup.array((yup.string() as any).enum(JobTeamDriver)).nullable()
                        })
                        .when("label", {
                            is: UserPreferenceMatchingLabel.MIN_PAY,
                            then: yup.number().min(0).required().nullable()
                        })
                        .when("label", {
                            is: UserPreferenceMatchingLabel.PAY_METHOD,
                            then: yup.array((yup.string() as any).enum(JobPayMethod)).nullable()
                        })
                        .when("label", {
                            is: UserPreferenceMatchingLabel.BENEFITS,
                            then: yup.array((yup.string() as any).enum(JobBenefits)).nullable()
                        })
                })
        });
    }
}
