import * as yup from "yup";
import { Status } from "../../enums/status.enum";

export class ReferralSourceEntity {
    id?: number;
    status?: Status;
    referrals?: number;
    referralAmount?: number;
    name?: string;
    code?: string;
    source?: string;
    medium?: string;
    campaign?: string;
    createdAt?: Date | string;
    createdBy?: number;
    updatedAt?: Date | string;
    updatedBy?: number;

    static yupSchema() {
        return yup.object({
            name: yup.string().required().nullable(),
            code: yup.string().required().nullable(),
            source: yup.string().required().nullable(),
            medium: yup.string().required().nullable(),
        });
    }

    static getReferralUrl(host: string, entity: ReferralSourceEntity, slug: string) {
        return `${host}/apply/${slug}?utm_source=${entity?.source}&utm_medium=${entity?.medium}&utm_campaign=${entity?.code}&referral_name=${entity?.name}`;
    }
}