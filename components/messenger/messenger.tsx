import { CancelTokenSource } from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { ApplicantDocumentType } from "../../enums/applicants/applicant-document-type.enum";
import { ChattableType } from "../../enums/conversation/chattable-type.enum";
import { UserPreferenceCategory } from "../../enums/users/user-preference-category.enum";
import { UserPreferenceCommunicationLabel } from "../../enums/users/user-preferences-communication-label.enum";
import { useAuth } from "../../hooks/use-auth";
import { useTranslation } from "../../hooks/use-translation";
import { ApplicantEntity } from "../../models/applicant";
import { ConversationMessageEntity } from "../../models/conversation/conversation-message.entity";
import {
    ConversationEntity,
    CreateConversationDto,
} from "../../models/conversation/conversation.entity";
import { UserPreferenceEntity } from "../../models/user/user-preference.entity";
import ApplicantApi from "../../pages/api/applicant";
import { ConversationApi } from "../../pages/api/conversation";
import UserApi from "../../pages/api/user";
import { useEffectAsync } from "../../utils/react";
import { ComboboxItem } from "../controls/combobox";
import { ConversationForm } from "./conversation-form";
import { ConversationList } from "./conversation-list";
import { messengerSocketInitializer } from "./socketInitializer";

export interface MessengerProps {
    getOptions?: (
        query: string,
        cancellationToken: CancelTokenSource
    ) => ComboboxItem[];
}

export function Messenger(props) {
    const { getOptions } = props;

    const { t } = useTranslation();
    const { user } = useAuth();

    const conversationApi = new ConversationApi();

    enum SocketEventType {
        INBOUND_MESSAGE = "inbound-message",
        OUTBOUND_MESSAGE_STATUS = "outbound-message-status",
    }

    const [socketData, setSocketData] = useState<{
        event: SocketEventType;
        message: ConversationMessageEntity;
    }>(null);
    const resetSocketData = () => setSocketData(null);

    const [conversations, setConversations] = useState<ConversationEntity[]>([]);
    const [userPreferences, setUserPreferences] = useState<
        UserPreferenceEntity[]
    >([]);

    const [conversation, setConversation] = useState<ConversationEntity>(
        new ConversationEntity()
    );

    const [applicant, setApplicant] = useState<ApplicantEntity>(
        new ApplicantEntity()
    );

    async function updateConversationsForInboundMessage(
        message: ConversationMessageEntity
    ): Promise<void> {
        console.log("Inbound message", message)
        if (message?.conversation?.id == conversation?.id) {
            // let messages: ConversationMessageEntity[] =
            //     conversation?.messages?.filter((m) => m?.id != message?.id) ?? [];
            // messages?.push(message);
            // messages = messages?.sort((a, b) => a?.id - b?.id);
            // const lastMessage: ConversationMessageEntity =
            //     conversation?.lastMessage?.id > message?.id
            //         ? conversation?.lastMessage
            //         : message;
            // const updatedConversation: ConversationEntity = {
            //     ...conversation,
            //     messages,
            //     lastMessage,
            // };
            // console.log("message received for current conversation", updatedConversation);
            // const c = await conversationApi.markRead(message?.conversation?.id)
            // onConversationUpdated(c)
            // setConversation(new ConversationEntity());
            // setConversation(updatedConversation);
            // const updatedConversations = conversations
            //     ?.map((c) => (c.id == updatedConversation.id ? updatedConversation : c))
            //     ?.sort((a, b) => b?.lastMessage?.id - a?.lastMessage?.id);
            // setConversations(updatedConversations);


            const updatedConversation: ConversationEntity = {
                ...conversation,
                messages: conversation?.messages?.map((m) =>
                    m.id == message.id ? message : m
                ),
                lastMessage:
                    conversation?.lastMessage?.id == message?.id
                        ? message
                        : conversation?.lastMessage,
            };
            setConversation(updatedConversation);

        } else {
            const updatedConversations = conversations
                ?.map((c) =>
                    c.id == message?.conversation?.id
                        ? { ...c, ...message?.conversation, lastMessage: message }
                        : c
                )
                ?.sort((a, b) => b?.lastMessage?.id - a?.lastMessage?.id);
            setConversations(updatedConversations);
            toast.info(
                <>
                    {t("NEW_MESSAGE_FROM")}
                    <span className="text-theme">
                        {message?.conversation?.chattable_name}
                    </span>
                </>,
                {
                    onClick: () =>
                        onConversationClick(
                            conversations.find((c) => c.id == message.conversation?.id)
                        ),
                }
            );
        }
        resetSocketData();
    }

    async function updateConversationsForOutboundMessageStatus(
        message: ConversationMessageEntity
    ): Promise<void> {
        if (message?.conversation?.id == conversation.id) {
            const updatedConversation: ConversationEntity = {
                ...conversation,
                messages: conversation?.messages?.map((m) =>
                    m.id == message.id ? message : m
                ),
                lastMessage:
                    conversation?.lastMessage?.id == message?.id
                        ? message
                        : conversation?.lastMessage,
            };
            setConversation(updatedConversation);
        }
        resetSocketData();
    }

    function handleInboundMessage(message: ConversationMessageEntity): void {
        setSocketData({ event: SocketEventType.INBOUND_MESSAGE, message });
    }

    function handleOutboundMessageStatus(
        message: ConversationMessageEntity
    ): void {
        setSocketData({ event: SocketEventType.OUTBOUND_MESSAGE_STATUS, message });
    }

    useEffectAsync(async () => {
        if (Boolean(socketData?.event))
            ({
                [SocketEventType.INBOUND_MESSAGE]:
                    await updateConversationsForInboundMessage(socketData?.message),
                [SocketEventType.OUTBOUND_MESSAGE_STATUS]:
                    await updateConversationsForOutboundMessageStatus(
                        socketData?.message
                    ),
            })[socketData?.event];
    }, [socketData]);

    async function fetchConversations() {
        const c = await conversationApi.list();
        setConversations(c?.sort((a, b) => b?.lastMessage?.id - a?.lastMessage?.id));
    }

    useEffectAsync(async () => {
        await fetchConversations();
        /* initialize the socket connection to the server. */
        messengerSocketInitializer(
            user,
            handleInboundMessage,
            handleOutboundMessageStatus
        );
    }, [user]);

    const onCreateClick = (e) => {
        setConversation(new ConversationEntity());
    };

    const onConversationClick = async (c: ConversationEntity) => {
        const applicantApi = new ApplicantApi();

        /* Resetting the user preferences to null, and then if the chattable type is a user, it is setting the
                                                    user preferences to the preferences of the user. */
        setUserPreferences(null);
        let applicantProfile: ApplicantEntity;
        if (c.chattable_type == ChattableType.USER) {
            const userApi = new UserApi();
            const preferences: UserPreferenceEntity[] =
                await userApi.preferences.list(c.chattable_id, {
                    category: UserPreferenceCategory.COMMUNICATION,
                    label: UserPreferenceCommunicationLabel.PREFERRED_HOURS,
                });
            setUserPreferences(preferences);
            applicantProfile = await applicantApi.getByUserId(c.chattable_id);
        } else if (c.chattable_type == ChattableType.APPLICANT) {
            applicantProfile = await applicantApi.getById(c.chattable_id);
        }
        const docs = applicantProfile?.documents?.filter((v) =>
            Object.values(ApplicantDocumentType).includes(
                v.type as ApplicantDocumentType
            )
        );
        setApplicant({ ...applicantProfile, documents: docs ?? [] });
        c = await conversationApi.markRead(c.id);
        onConversationUpdated(c);
    };

    const onDeleteConversation = async (e: ConversationEntity) => {
        const { id } = e;

        if (id) {
            await conversationApi.remove(id);

            const c = conversations.filter((v) => v?.id != id);
            setConversations(c);

            if (conversation?.id == id) setConversation(new ConversationEntity());
        }
    };

    const onConversationCreated = async (c: ConversationEntity) => {
        const applicantApi = new ApplicantApi();
        const updatedConversations = [...conversations, c]?.sort(
            (a, b) => b?.lastMessage?.id - a?.lastMessage?.id
        );
        setConversations(updatedConversations);
        setConversation(c);
        setUserPreferences(null);
        let applicantProfile: ApplicantEntity;
        if (c.chattable_type == ChattableType.USER) {
            const userApi = new UserApi();
            const preferences: UserPreferenceEntity[] =
                await userApi.preferences.list(c.chattable_id, {
                    category: UserPreferenceCategory.COMMUNICATION,
                    label: UserPreferenceCommunicationLabel.PREFERRED_HOURS,
                });
            setUserPreferences(preferences);
            applicantProfile = await applicantApi.getByUserId(c.chattable_id);
        } else if (c.chattable_type == ChattableType.APPLICANT) {
            applicantProfile = await applicantApi.getById(c.chattable_id);
        }
        const docs = applicantProfile?.documents?.filter((v) =>
            Object.values(ApplicantDocumentType).includes(
                v.type as ApplicantDocumentType
            )
        );
        setApplicant({ ...applicantProfile, documents: docs ?? [] });
    };

    const onConversationUpdated = (e: ConversationEntity) => {
        const newConversations = conversations
            .map((v) =>
                v.id == e.id
                    ? {
                        ...v,
                        lastMessage: e.lastMessage,
                        unread: e.unread,
                    }
                    : v
            )
            ?.sort((a, b) => b?.lastMessage?.id - a?.lastMessage?.id);
        setConversation(e);
        setConversations(newConversations);
    };

    const onConversationToChange = (e: CreateConversationDto) => {
        setApplicant(new ApplicantEntity());
        if (e.chattable_id) {
            const existing = conversations.find(
                (v) =>
                    v.chattable_id == e.chattable_id &&
                    v.chattable_type == e.chattable_type
            );

            if (existing) onConversationClick(existing);
        }
    };

    const lastMessage = React.createRef<HTMLLIElement>();

    useEffect(
        () => {
            (lastMessage.current?.scrollIntoView({ behavior: "smooth" }));
            return () => { }
        },
        [lastMessage]
    );

    useEffect(() => {
        const interval = setInterval(async () => {
            await fetchConversations();
        }, 120000); // 120000 ms = 2 minutes

        return () => clearInterval(interval); // Clean up on component unmount
    }, []);

    const canCreate = true;

    return (
        <section className="p-2" style={{ backgroundColor: "#eee" }}>
            <Row>
                <Col md="6" lg="5" xl="4" className="mb-4 mb-md-0">
                    <Card>
                        <Card.Body >
                            {!!conversation.chattable_id && (
                                <Button
                                    className="w-100 mt-0 mb-2"
                                    variant="primary"
                                    onClick={onCreateClick}
                                >
                                    <Plus /> {t("CREATE_NEW_MESSAGE")}
                                </Button>
                            )}
                            <ConversationList
                                items={conversations}
                                selected={conversation}
                                onItemClick={onConversationClick}
                                onItemDelete={onDeleteConversation}
                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md="6" lg="7" xl="8">
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
                </Col>
            </Row>
        </section>
    );
}
