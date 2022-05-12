import { UserEntity } from "../user/user.entity";
import { CompanyEntity } from "../company/company.entity";

import { ConversationMessageEntity } from "./conversation-message.entity";

import { Status } from "../../enums/status.enum";
import { ChattableType } from "../../enums/conversation/chattable-type.enum";

import * as yup from "yup";
import "../../utils/yup";

export class CreateConversationDto {
    chattable_type?: ChattableType;
    chattable_id?: number;
    chattable_name?: string;
    message: string;

    static yupSchema() {
        return yup.object({
            chattable_type: (yup.string() as any).enum(ChattableType).required().nullable(),
            chattable_id: yup.number().required().nullable(),
            chattable_name: yup.string().required().nullable(),
            message: yup.string().max(250).required().nullable(),
        });
    }
}

export class UpdateConversationDto {
    chattable_name?: string;
    message: string;

    static yupSchema() {
        return yup.object({
            chattable_name: yup.string().required().nullable(),
            message: yup.string().max(250).required().nullable(),
        });
    }
}

export class ConversationEntity {
    id?: number;
    company: CompanyEntity;
    user: UserEntity;
    chattable_type?: ChattableType;
    chattable_id?: number;
    chattable_name?: string;
    status: Status;
    unread: number;
    lastMessage: ConversationMessageEntity;
    messages?: ConversationMessageEntity[];

    static yupSchema() {
        return yup.object({
            chattable_type: (yup.string() as any).enum(ChattableType).required().nullable(),
            chattable_id: yup.number().required().nullable(),
            chattable_name: yup.string().required().nullable(),
        });
    }

    static CreateDto = CreateConversationDto
    static UpdateDto = UpdateConversationDto

}
