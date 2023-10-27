import { CancelTokenSource } from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Navbar, Row } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { ChattableType } from "../../enums/conversation/chattable-type.enum";
import { UserPreferenceCategory } from "../../enums/users/user-preference-category.enum";
import { UserPreferenceCommunicationLabel } from "../../enums/users/user-preferences-communication-label.enum";
import { useAuth } from "../../hooks/use-auth";
import {
    useTranslation,
} from "../../hooks/use-translation";
import {
    ConversationEntity,
    CreateConversationDto,
} from "../../models/conversation/conversation.entity";
import { UserPreferenceEntity } from "../../models/user/user-preference.entity";
import { ConversationApi } from "../../pages/api/conversation";
import UserApi from "../../pages/api/user";
import { useEffectAsync } from "../../utils/react";
import { ComboboxItem } from "../controls/combobox";
import { ConversationForm } from "./conversation-form";
import { ConversationList, ConversationListItem } from "./conversation-list";
import { ApplicantEntity } from "../../models/applicant";
import ApplicantApi from "../../pages/api/applicant";
import { ApplicantDocumentType } from "../../enums/applicants/applicant-document-type.enum";
import { messengerSocketInitializer } from "./socketInitializer";
import { ConversationMessageEntity } from "../../models/conversation/conversation-message.entity";

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

    enum SocketEventType {
        INBOUND_MESSAGE = "inbound-message",
        OUTBOUND_MESSAGE_STATUS = "outbound-message-status",
    }

    const [socketData, setSocketData] = useState<{
        event: SocketEventType;
        message: ConversationMessageEntity;
    }>(null);
    const resetSocketData = () => setSocketData(null)

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

    async function handleInboundMessage(message: ConversationMessageEntity): Promise<void> {
        console.log(`reply-to-user-${user?.id}`, message);

        console.log("conversations", conversations);
        toast(
            t(
                "NEW_MESSAGE_{from}",
                { from: message?.conversation?.chattable_name ?? "APPLICANT" },
                { translateProps: true }
            )
        );
        // const newConversations = conversations?.map((c) => {
        //     if (c?.id == message?.conversation?.id)
        //         return {
        //             ...c,
        //             messages: ([...c.messages, message]).sort((a, b) => a?.id - b?.id),
        //         };
        //     return c;
        // });
        // console.log("newConversations", newConversations);

        // setConversations(newConversations);
    }

    function updateConversationsForOutboundMessageStatus(message: ConversationMessageEntity) {
        console.log("testing conversation message", message);
        console.log("testing active conversation", conversation);
        if (message?.conversation?.id == conversation.id) {
            console.log("testing message?.conversation?.id == conversation.id", message?.conversation?.id == conversation.id);

            const updatedConversation = {
                ...conversation,
                message: conversation?.messages?.map(m => {
                    console.log("m.id == message.id", m.id == message.id, m.id, message.id);
                    return (m.id == message.id ? message : m)
                })
            }
            console.log("testing updatedConversation", updatedConversation);

            setConversation(updatedConversation)
        }
        // const newConversations = conversations?.map((c) => {
        //     if (c?.id == message?.conversation?.id)
        //         return {
        //             ...c,
        //             messages: c.messages.map((m) => (m.id == message.id ? message : m)),
        //         };
        //     return c;
        // });
        // console.log("newConversations", newConversations);

        // setConversations(newConversations);
        resetSocketData()
    }

    async function handleOutboundMessageStatus(message: ConversationMessageEntity): Promise<void> {
        console.log(`outbound-sms-status-for-user-${user?.id}`, message);
        setSocketData({ event: SocketEventType.INBOUND_MESSAGE, message })
        // updateConversationsForOutboundMessageStatus(message)
    }

    useEffect(() => {
        if (socketData?.event)
            ({
                // [SocketEventType.INBOUND_MESSAGE]:,
                [SocketEventType.OUTBOUND_MESSAGE_STATUS]:
                    updateConversationsForOutboundMessageStatus(socketData?.message),
            })[socketData?.event];
    }, [socketData])

    async function fetchConversations() {
        const api = new ConversationApi();
        const c = await api.list();
        setConversations(c);
    }

    useEffectAsync(async () => {
        await fetchConversations()
        /* initialize the socket connection to the server. */
        messengerSocketInitializer(
            user,
            handleInboundMessage,
            handleOutboundMessageStatus,
        );
    }, [user]);

    const onCreateClick = (e) => {
        setConversation(new ConversationEntity());
    };

    const onConversationClick = async (c: ConversationEntity) => {
        const conversationApi = new ConversationApi();
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
            const api = new ConversationApi();

            await api.remove(id);

            const c = conversations.filter((v) => v?.id != id);
            setConversations(c);

            if (conversation?.id == id) setConversation(new ConversationEntity());
        }
    };

    const onConversationCreated = async (c: ConversationEntity) => {
        const conversationApi = new ConversationApi();
        const applicantApi = new ApplicantApi();
        const Cons = [...conversations, c]?.sort(
            (a, b) => b?.lastMessage?.id - a?.lastMessage?.id
        );
        setConversations(Cons);
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
                v.id === e.id
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
                    v.chattable_id === e.chattable_id &&
                    v.chattable_type === e.chattable_type
            );

            if (existing) onConversationClick(existing);
        }
    };

    const lastMessage = React.createRef<HTMLLIElement>();

    useEffect(
        () => lastMessage.current?.scrollIntoView({ behavior: "smooth" }),
        [lastMessage]
    );

    const canCreate = !!getOptions;

    return (
        <Row>
            <Col md="6" lg="5" xl="4" className="messages_container">
                <Card>
                    <Card.Body className="p-2">
                        <Navbar expand="lg">
                            <Navbar.Toggle
                                aria-controls="convo-navbar-nav "
                                className="w-100"
                            >
                                {conversation && <ConversationListItem entity={conversation} />}
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
                        {canCreate && (
                            <Button
                                className="w-100 mt-1"
                                variant="primary"
                                onClick={onCreateClick}
                            >
                                <Plus /> {t("CREATE_NEW_MESSAGE")}
                            </Button>
                        )}
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
