import { MessageStatus } from "../../enums/conversation/message-status.enum";
import { ConversationEntity } from "./conversation.entity";

import * as yup from "yup";
import { MessageDirection } from "../../enums/conversation/message-direction.enum";

export class ConversationMessageEntity {
    id?: number;
    status?: MessageStatus;
    conversation?: ConversationEntity;
    direction?: MessageDirection;
    text?: string;
    created_at?: string | Date;

    static yupSchema() {
        return yup.object({
            text: yup.string().required().nullable()
        });
    }
}