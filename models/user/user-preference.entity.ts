import { UserPreferenceCategory } from "../../enums/users/user-preference-category.enum";
import { UserEntity } from "./user.entity";
import * as yup from "yup";
import "../../utils/yup";
import { UserPreferenceCommunicationLabel } from "../../enums/users/user-preferences-communication-label.enum";
import { CommunicationMethod } from "../../enums/users/communication-method.enum";
import { UserPreferenceSharingLabel } from "../../enums/users/user-preference-sharing-label.enum";
import { SharePreference } from "../../enums/users/share-preference.enum";

export class UserPreferenceEntity {
    constructor() {}
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
                })
                .when("category", {
                    is: UserPreferenceCategory.SHARING,
                    then: (yup.string().required() as any).enum(SharePreference)
                })
        });
    }
}
  