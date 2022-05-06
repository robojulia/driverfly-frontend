import { UserEntity } from "../user/user.entity";
import { CompanyEntity } from "../company/company.entity";

import { ConversationMessageEntity } from "./conversation-message.entity";

import { Status } from "../../enums/status.enum";
import { ChattableType } from "../../enums/conversation/chattable-type.enum";

import * as yup from "yup";

export class ConversationEntity {
    id?: number;
    company: CompanyEntity;
    user: UserEntity;
    chattable_type?: ChattableType;
    chattable_id?: number;
    chattable_key: string;
    status: Status;
    name: string;
    messages?: ConversationMessageEntity[];

    static yupSchema() {
        return yup.object({
            chattable_type: (yup.string() as any).enum(ChattableType).required().nullable(),
            chattable_id: yup.number().required().nullable(),
            chattable_key: yup.string().required().nullable(),
            name: yup.string().required().nullable()
        });
    }
}