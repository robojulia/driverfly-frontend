import { CancelTokenSource } from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Navbar, Row } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { useAuth } from "../../hooks/use-auth";
import { useTranslation } from "../../hooks/use-translation";
import { ConversationEntity, CreateConversationDto } from "../../models/conversation/conversation.entity";
import { ConversationApi } from "../../pages/api/conversation";
import { useEffectAsync } from "../../utils/react";
import { ComboboxItem } from "../controls/combobox";
import { ConversationForm } from "./conversation-form";
import { ConversationList, ConversationListItem } from "./conversation-list";

export interface MessengerProps {
    getOptions?: (query: string, cancellationToken: CancelTokenSource) => ComboboxItem[]

}

export function Messenger(props) {
    const { getOptions } = props;

    const { t } = useTranslation();

    const { user } = useAuth();

    const [conversations, setConversations] = useState<ConversationEntity[]>([]);

    const [conversation, setConversation] = useState<ConversationEntity>(new ConversationEntity());

    useEffectAsync(async () => {
        const api = new ConversationApi();
        const c = await api.list();

        setConversations(c);
    }, [ user ]);

     const onCreateClick = (e) => {
         setConversation(new ConversationEntity());
     }

     const onConversationClick = async (c: ConversationEntity) => {
         const api = new ConversationApi();

         c = await api.markRead(c.id);

        onConversationUpdated(c);
     }

    const onDeleteConversation = async (e: ConversationEntity) => {
        const { id } = e;

        if (id) {
            const api = new ConversationApi();

            await api.remove(id);

            const c = conversations.filter(v => v.id !== id);
            setConversations(c);

            if (conversation.id === id) setConversation(new ConversationEntity());
        }

    }

     const onConversationCreated = (e: ConversationEntity) => {
        setConversations([
            ...conversations,
            e
        ]);
        setConversation(e);
     }

     const onConversationUpdated = (e: ConversationEntity) => {
        const newConversations = conversations.map(v => (
            v.id === e.id ? {
                ...v,
                lastMessage: e.lastMessage,
                unread: e.unread,
            } : v
        ));
        setConversation(e);
        setConversations(newConversations);
     }

     const onConversationToChange = (e: CreateConversationDto) => {
         if (e.chattable_id) {
             const existing = conversations.find(v => v.chattable_id === e.chattable_id && v.chattable_type === e.chattable_type);

             if (existing)
                 onConversationClick(existing);
         }
     }

     const lastMessage = React.createRef<HTMLLIElement>();
     useEffect(() => lastMessage.current?.scrollIntoView({ behavior: "smooth" }), [lastMessage])


     const canCreate = !!getOptions;

    return (
    <Row>
        <Col md="6" lg="5" xl="4" className="messages_container">
            <Card>
                <Card.Body className="p-2">
                    <Navbar expand="lg">
                        <Navbar.Toggle aria-controls="convo-navbar-nav " className="w-100">
                            {conversation &&
                                <ConversationListItem entity={conversation} />
                            }
                        </Navbar.Toggle>
                        <Navbar.Collapse id="convo-navbar-nav">
                            <ConversationList
                                items={conversations}
                                selected={conversation}
                                onItemClick={onConversationClick}
                                onItemDelete={onDeleteConversation}
                            />
                        </Navbar.Collapse>
                    </Navbar>
                    {canCreate && <Button className="w-100 mt-1" variant="primary" onClick={onCreateClick}><Plus /> {t("CREATE_NEW_MESSAGE")}</Button>}
                </Card.Body>
            </Card>
        </Col>
        <Col md="6" lg="7" xl="8">
            <Card>
                <ConversationForm
                    entity={conversation}
                    canCreate={canCreate}
                    onCreated={onConversationCreated}
                    onUpdated={onConversationUpdated}
                    onConversationToChange={onConversationToChange}
                    getOptions={getOptions}
                    />
            </Card>
        </Col>
    </Row>

    );

}