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
        const params = new URLSearchParams();
        if (entity?.source) params.set('utm_source', entity.source);
        if (entity?.medium) params.set('utm_medium', entity.medium);
        if (entity?.campaign) params.set('utm_campaign', entity.campaign);
        if (entity?.code) params.set('referral_code', entity.code);
        if (entity?.name) params.set('referral_name', entity.name);
        return `${host}/apply/${slug}?${params.toString()}`;
    }
}