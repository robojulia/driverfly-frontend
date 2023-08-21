const io = require("socket.io-client");
import { Socket } from "socket.io-client";
import { CancelTokenSource } from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Navbar, Row } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { toast } from 'react-toastify'
import { ChattableType } from "../../enums/conversation/chattable-type.enum";
import { UserPreferenceCategory } from "../../enums/users/user-preference-category.enum";
import { UserPreferenceCommunicationLabel } from "../../enums/users/user-preferences-communication-label.enum";
import { useAuth } from "../../hooks/use-auth";
import { useTranslation } from "../../hooks/use-translation";
import { ConversationEntity, CreateConversationDto } from "../../models/conversation/conversation.entity";
import { UserPreferenceEntity } from "../../models/user/user-preference.entity";
import { ConversationApi } from "../../pages/api/conversation";
import UserApi from "../../pages/api/user";
import { useEffectAsync } from "../../utils/react";
import { ComboboxItem } from "../controls/combobox";
import { ConversationForm } from "./conversation-form";
import { ConversationList, ConversationListItem } from "./conversation-list";
import { ConversationMessageEntity } from "../../models/conversation/conversation-message.entity";
import { ApplicantEntity } from "../../models/applicant";
import ApplicantApi from "../../pages/api/applicant";
import { ApplicantDocumentType } from "../../enums/applicants/applicant-document-type.enum";
import { DocumentEntity } from "../../models/documents/document.entity";

/* Initializing a socket connection to the server. */
const socket: Socket = io(
    `${process.env.BASE_URL}`,
    {
        transports: ['websocket'],
        // rejectUnauthorized: false,
        // path: "/socket.io",
        // protocols: ["ws:// ", "wss://"],
    }
);

/**
 * function that initializes a socket connection to the server, and when the server sends a
 * message to the client, it finds the conversation that the message belongs to and opens it
 */
const socketInitializer = async (user, conversations, onConversationClick, t, toast): Promise<void> => {

    // Add a connect listener
    /* This code is setting up a listener for the 'connection' event on the socket object. When a client
    connects to the server, this event will be triggered and the function passed as the second argument
    will be executed. In this case, it simply logs a message to the console indicating that a client has
    connected. */
    socket.on('connect', () => {
        console.log('Socket :: Client connect.', socket?.id);
    });

    // Disconnect listener
    /* This code sets up a listener for the 'disconnect' event on the socket object. When a client
    disconnects from the server, this event will be triggered and the function passed as the second
    argument will be executed. In this case, it simply logs a message to the console indicating that a
    client has disconnected. */
    socket.on('disconnect', () => {
        console.log('Socket :: Client disconnected.');
    });

    // Error listener
    /* This code sets up a listener for the "connect_error" event on the socket object. When there is an
    error connecting to the server, this event will be triggered and the function passed as the second
    argument will be executed. In this case, it simply logs a message to the console indicating that
    there was a connection error and the reason for the error. */
    socket.on("connect_error", (err) => {
        console.log(`Socket :: connect_error due to ${err.message}`, err.stack);
        setTimeout(() => {
            socket.connect();
        }, 1000);
    });

    /* Listening for a message from the server, and when it receives a message, it finds the conversation
    that the message belongs to and opens it. */
    socket.on(
        `reply-to-user-${user?.id}`,
        async (message: ConversationMessageEntity): Promise<void> => {
            const c = conversations?.find(v => v.id == message?.conversation?.id)
            if (Boolean(c)) {
                toast(t(
                    'NEW_MESSAGE_{from}',
                    { from: message?.conversation?.chattable_name ?? "APPLICANT" },
                    { translateProps: true }
                ))
                onConversationClick(c)
            }
        }
    );
};

export interface MessengerProps {
    getOptions?: (query: string, cancellationToken: CancelTokenSource) => ComboboxItem[]

}

export function Messenger(props) {

    const { getOptions } = props;

    const { t } = useTranslation();

    const { user } = useAuth();

    const [conversations, setConversations] = useState<ConversationEntity[]>([]);
    const [userPreferences, setUserPreferences] = useState<UserPreferenceEntity[]>([]);

    const [conversation, setConversation] = useState<ConversationEntity>(new ConversationEntity());

    const [applicant, setApplicant] = useState<ApplicantEntity>(new ApplicantEntity());

    useEffectAsync(async () => {
        const api = new ConversationApi();
        const c = await api.list();

        setConversations(c);
    }, [user]);

    const onCreateClick = (e) => {
        setConversation(new ConversationEntity());
    }

    const onConversationClick = async (c: ConversationEntity) => {
        const conversationApi = new ConversationApi();
        const applicantApi = new ApplicantApi()

        /* Resetting the user preferences to null, and then if the chattable type is a user, it is setting the
        user preferences to the preferences of the user. */
        setUserPreferences(null)
        if (c.chattable_type == ChattableType.USER) {
            const userApi = new UserApi();
            const preferences: UserPreferenceEntity[] = await userApi.preferences
                .list(
                    c.chattable_id,
                    {
                        category: UserPreferenceCategory.COMMUNICATION,
                        label: UserPreferenceCommunicationLabel.PREFERRED_HOURS
                    }
                )
            setUserPreferences(preferences)
        } else if (c.chattable_type == ChattableType.APPLICANT) {
            const res = await applicantApi.getById(c.chattable_id)
            const docs = res?.documents?.filter((v) =>
                Object.values(ApplicantDocumentType).includes(
                    v.type as ApplicantDocumentType
                )
            );
            setApplicant({ ...res, documents: docs ?? [] })
        }

        c = await conversationApi.markRead(c.id);

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

            if (existing) onConversationClick(existing);
        }
    }

    const lastMessage = React.createRef<HTMLLIElement>();
    useEffect(() => lastMessage.current?.scrollIntoView({ behavior: "smooth" }), [lastMessage])

    const canCreate = !!getOptions;

    /* A hook that is used to initialize the socket connection to the server. */
    useEffectAsync(() => socketInitializer(user, conversations, onConversationClick, t, toast), [user]);
    console.log("entity form masseger parent", conversation)

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
                        applicant={applicant}
                        entity={conversation}
                        userPreferences={userPreferences}
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