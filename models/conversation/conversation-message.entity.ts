import { MessageStatus } from "../../enums/conversation/message-status.enum";
import { ConversationEntity } from "./conversation.entity";

import * as yup from "yup";

export class ConversationMessageEntity {
    id?: number;
    status?: MessageStatus;
    conversation?: ConversationEntity;
    direction?: string; 
    text?: string;
    created_at?: Date;

    static yupSchema() {
        return yup.object({
            text: yup.string().required().nullable()
        });
    }
}