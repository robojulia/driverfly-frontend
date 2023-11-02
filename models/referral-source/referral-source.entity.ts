import { Status } from "../../enums/status.enum";
import * as yup from "yup";

export class ReferralSourceEntity {
    id?: number;
    status?: Status;
    referrals?: number;
    name?: string;
    code?: string;
    createdAt?: Date | string;
    createdBy?: number;
    updatedAt?: Date | string;
    updatedBy?: number;

    static yupSchema() {
        return yup.object({
            name: yup.string().required().nullable(),
            code: yup.string().required().nullable()
        });
    }

    static getReferralUrl(host: string, entity: ReferralSourceEntity, companyId: number) {
        return `${host}/form/digitalhiringapp/${companyId}?utm_source=rep&utm_medium=rep&utm_campaign=${entity.code}&referral_name=${entity?.name}`;
    }
}