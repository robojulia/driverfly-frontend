import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Clock, InfoCircleFill } from "react-bootstrap-icons";
import { MessageDirection } from "../../enums/conversation/message-direction.enum";

import { ConversationMessageEntity } from "../../models/conversation/conversation-message.entity";
import { ConversationEntity } from "../../models/conversation/conversation.entity";
import When from "../view-details/when";
import OverlyPopover from "../popover/overly-popover";
import { MessageStatus } from "../../enums/conversation/message-status.enum";

export interface MessageProps {
    conversation: ConversationEntity;
    message: ConversationMessageEntity;
    showHeader?: boolean;
    lastMessageRef?: React.Ref<HTMLLIElement>;
}

export function Message(props: MessageProps) {
    const { conversation, message, showHeader, lastMessageRef } = props;

    return (
        <li ref={lastMessageRef} className="d-flex justify-content-between p-0">
            <Card className="w-100 m-0 border-0">
                {showHeader &&
                    <Card.Header className={`d-flex justify-content-${message.direction == MessageDirection.OUT ? "end" : "start"} p-3`}>
                        <p className="fw-bold mb-0">{message.direction == MessageDirection.OUT ? conversation.user.name : conversation.chattable_name}</p>
                    </Card.Header>
                }
                <Card.Body className="pb-0 pt-1">
                    <Row className={`justify-content-${message.direction == MessageDirection.OUT ? "end" : "start"}`}>
                        <Col sm="8" md="7" lg="6" className="rounded-lg p-2" style={{ backgroundColor: message.direction == MessageDirection.OUT ? "#cdf3f2" : "#e9fafa" }}>
                            {message.text}
                            <p className="text-muted small mb-0">
                                <Clock /> <When date={message.created_at} />
                                {message.status && <> -- <span className={message.status == MessageStatus.FAILED ? "text-danger" : ""} >{[MessageStatus.QUEUED, MessageStatus.SENDING].includes(message.status) ? MessageStatus.SENT : message.status}</span></>}
                                {Boolean(message.error_message)
                                    && message.error_code == 21211
                                    && <OverlyPopover str={message.error_message}>
                                        <InfoCircleFill role="button" className="ml-2 text-danger" />
                                    </OverlyPopover>}
                            </p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </li>
    );

}
