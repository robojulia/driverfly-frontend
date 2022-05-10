
import { Navbar, Container, Row, Col, Card, Button, FormGroup, Form } from "react-bootstrap";
import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import useRedirect from '../../../../hooks/useRedirect';
import React, { useEffect, useState } from "react";

import {PenFill, TrashFill, Eye, EyeFill, Clock, Plus, Trash, XCircle} from 'react-bootstrap-icons';

import Link from "next/link";

import { ConversationApi } from "../../../api/conversation";
import { ApplicantApi } from "../../../api/applicant";
import { ConversationEntity } from "../../../../models/conversation/conversation.entity";

import { useTranslation } from "../../../../hooks/useTranslation";
import { useRouter } from "next/router";
import useAuth from "../../../../hooks/useAuth";

import ViewModal from "../../../../components/viewDetails/viewModal";
import { ConversationMessageEntity } from "../../../../models/conversation/conversation-message.entity";

import ComboBox from "../../../../components/controls/combobox";
import BaseTextArea from "../../../../components/forms/BaseTextArea";
import { ChattableType } from "../../../../enums/conversation/chattable-type.enum";
import axios from "axios";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import When from "../../../../components/viewDetails/when";
/**
 * @type {ConversationEntity[]}
 */
const CONVERSATION_LIST_PROTO = [];

export default function MessageList() {

    const { authCompany } = useRedirect();

    authCompany()

    const { authCheck } = useAuth();

    const user = authCheck();

    const { t } = useTranslation();
    const router = useRouter()
    const [conversations, setConversations] = useState(CONVERSATION_LIST_PROTO);

    const [conversation, setConversation] = useState(new ConversationEntity());

    useEffect(async () => {
        const api = new ConversationApi();
        const c = await api.list();

        setConversations(c);

        if (!conversation.id && c.length > 0) onConversationClick(c[0]);
    }, []);
    /**
     * 
     * @param {ConversationEntity} c 
     */
     const getConversationName = (c) => user.id === c.user?.id ? c.chattable_name : c.user?.name;

     const onCreateClick = (e) => {
         setConversation(new ConversationEntity());
         form.resetForm();
     }

     const [ cancelTokenSource, setCancelTokenSource] = useState(null);

     const getOptions = async (query) => {
         const api = new ApplicantApi();

        if (cancelTokenSource)
            cancelTokenSource.cancel("New search results posted");

        let tokenSource = axios.CancelToken.source();
        setCancelTokenSource(tokenSource);

        try {
            const applicants = await api.search({
                last_name: query,
                first_name: query,
                // email: query,
                phone: query
            }, {
                cancelToken: tokenSource.token
            });

            return applicants.map(v => ({
                text: `${v.first_name} ${v.last_name}`,
                value: {
                    chattable_type: ChattableType.APPLICANT,
                    chattable_id: v.id,
                    chattable_name: `${v.first_name} ${v.last_name}`
                }
            }));
        }
        catch (e) {
            if (axios.isCancel(e)) {
                console.warn("cancelled?", e);
                return [];
            }

            throw e;
        }
     };

     /**
      * 
      * @param {ConversationEntity} c 
      */
     const onConversationClick = async c => {
         const api = new ConversationApi();

         setConversation({
             ...c,
             messages: c.id ? await api.messages.list(c.id) : []
         });
         form.setValues({
             ...form.values,
             chattable_type: c.chattable_type,
             chattable_id: c.chattable_id,
             chattable_name: c.chattable_name,
             message: null
         }, false);
     }

     const onConversationToChange = e => {
         const { name, value } = e.target;

         //value.chattable_id, value.chattable_type;
         if (value) {
         const existing = conversations.find(v => 
            v.chattable_id === value.chattable_id &&
            v.chattable_type === value.chattable_type);

            if (existing) {
                onConversationClick(existing);
                return;
            }
        }
        form.setValues({
            ...form.values,
            chattable_type: value?.chattable_type,
            chattable_id: value?.chattable_id,
            chattable_name: value?.chattable_name,
        });
    }

    const onDeleteConversation = async (id) => {
        if (id) {
            const api = new ConversationApi();

            await api.remove(id);

            const c = conversations.filter(v => v.id !== id);
            setConversations(c);

            if (conversation.id === id) onConversationClick(c[0] || new ConversationEntity());
        }

    }

     const form = useFormik({
         initialValues: new ConversationEntity.CreateDto(),
         validationSchema: ConversationEntity.CreateDto.yupSchema(),
         onSubmit: async (dto) => {
             const api = new ConversationApi();

             let convo = {
                 ...conversation
             };
             try {
                if (convo.id) {
                    convo.messages = [
                        ...conversation.messages || [],
                        await api.messages.create(convo.id, {
                            text: dto.message
                        })
                    ];
                    
                    setConversations(conversations.map(v => (
                        v.id === convo.id ? {
                            ...convo,
                            lastMessage: convo.messages.at(-1),
                            messages: [],
                        } : v
                    )));
                }
                else {
                    convo = await api.create(dto);

                    setConversations([
                        ...conversations,
                        {
                            ...convo,
                            lastMessage: convo.messages[0]
                        }
                    ])
    
                }

                setConversation(convo);

                form.setValues({
                    ...dto,
                    message: null
                }, false);
            } catch (e) {
                console.error("Unable to save convo info", e);

                toast.error(t("unable_to_save_information"));
            }

         }
     });

    return (
        <>
        <ToastContainer />
        <Row>
            <Col md="6" lg="5" xl="4" className="mb-4 mb-md-0">
                <h4 class="font-weight-bold mb-3 text-center text-lg-start">{t("MESSAGES")}</h4>
                <Card>
                    <Card.Body>
                        <Navbar expand="lg">
                            <Navbar.Toggle aria-controls="convo-navbar-nav " className="w-100">
                                {conversation &&
                                    <Conversation conversation={conversation} user={user} t={t} />
                                }
                            </Navbar.Toggle>
                            <Navbar.Collapse id="convo-navbar-nav">
                                {
                                    conversations.length == 0 &&
                                    <span className="text-center w-100">{t("NO_{name}_FOUND", { name: "CONVERSATIONS" }, { translateProps: true })}</span>
                                }
                                {
                                    conversations.length > 0 &&
                                    <ul className="list-unstyled mb-0 w-100" style={{ overflowY: "auto", height: "50vh" }}>
                                        {
                                            conversations.map((c, i) => (
                                            <li key={i} className="p-2 border-bottom" style={{ backgroundColor: c.id === conversation?.id ? "#fff" : "#eee", cursor: "pointer" }} onClick={e => onConversationClick(c)}>
                                                <Conversation conversation={c} user={user} onDelete={onDeleteConversation} />
                                            </li>
                                            ))
                                        }
                                    </ul>
                                }
                            </Navbar.Collapse>
                        </Navbar>
                        <Button className="w-100 mt-1" variant="primary" onClick={onCreateClick}><Plus /> {t("CREATE_NEW_MESSAGE")}</Button>
                        {/* <Button className="w-100 mt-2" variant="primary">+ Set Up SMS Campaign</Button>
                        <Button className="w-100 mt-2" variant="primary">+ Create Report</Button> */}
                    </Card.Body>
                </Card>
            </Col>
            <Col md="6" lg="7" xl="8">
                <Card>
                    <Form onSubmit={form.handleSubmit}>
                        <Card.Header>
                            {conversation.id ? getConversationName(conversation) : <ComboBox options={getOptions} onChange={onConversationToChange} minLength={3} />}
                            {typeof form.errors?.chattable_id === "string" &&
                            <span className="text-danger small">{form.errors.chattable_id}</span>
                            }
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled" style={{ overflowY: "auto", height: "50vh" }}>
                                {
                                    conversation?.messages?.map((m, i, a) => (
                                        <Message key={i} conversation={conversation} message={m} user={user} t={t} showHeader={m.direction !== a[i - 1]?.direction} />
                                    ))
                                }
                            </ul>
                        </Card.Body>
                        <Card.Footer>
                            <form className="form-outline">
                                <BaseTextArea
                                    name="message"
                                    formik={form}
                                    required
                                    placeholder="MESSAGE" />
                                <button type="submit" className="btn btn-info float-end" onClick={form.handleSubmit}>{t("SEND")}</button>
                            </form>
                        </Card.Footer>
                    </Form>
                </Card>
            </Col>
        </Row>

        </>
    )

};

MessageList.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}


/**
 * @param {object} props
 * @param {ConversationEntity} props.conversation
 * @param {import("../../../../models/user/user.entity").UserEntity} props.user
 * @param {(number) => void} props.onDelete
 */
function Conversation(props) {
    const { conversation, user, onDelete } = props;

     return (
        <div className="d-flex justify-content-between text-start">
            <div className="pt-1">
                <p className="fw-bold mb-0">{user.id === conversation.user?.id ? conversation.chattable_name : conversation.user?.name}</p>
                {
                    conversation.lastMessage &&
                    <p title={conversation.lastMessage.text} className="small text-muted text-truncate" style={{ width: "200px"}}>{conversation.lastMessage.text}</p>
                }
            </div>
            <div className="pt-1">
                {
                    conversation.lastMessage &&
                    <p className="small text-muted mb-1"><When date={conversation.lastMessage.created_at} /></p>
                }
                {
                    conversation.lastMessage && conversation.unread > 0 && (
                        user.id === conversation.user?.id && conversation.lastMessage.direction === "in" ||
                        user.id !== conversation.user?.id && conversation.lastMessage.direction === "out"
                    ) &&
                    <span className="badge bg-danger float-end">{conversation.unread}</span>
                }
            </div>
            {onDelete && <XCircle color="red" onClick={e => onDelete(conversation.id)} />}
        </div>
     );
}

/**
 * 
 * @param {object} props 
 * @param {ConversationEntity} props.conversation
 * @param {ConversationMessageEntity} props.message
 * @param {import("../../../../models/user/user.entity").UserEntity} props.user
 * @param {boolean} props.showHeader
 * @param {(string) => (string)} props.t
 */
function Message(props) {
    const { conversation, message, user, showHeader, t } = props;

    const from = message.direction === "out" ? conversation.user.name : conversation.chattable_name;

    const direction = (user.id === conversation.user.id && message.direction === "out"
    || user.id !== conversation.user.id && message.direction === "in"
     ) ? "out" : "in";

    return (
    <li className="d-flex justify-content-between p-0">
        <Card className="w-100 m-0">
            {showHeader &&
                <Card.Header className={`d-flex justify-content-${direction === "out" ? "end" : "start"} p-3`}>
                    <p className="fw-bold mb-0">{from}</p>
                </Card.Header>
            }
            {/* <Card.Img></Card.Img> */}
            {/* <img class="card-img-top" src="..." alt="Card image cap"> */}

            <Card.Body className="pb-0 pt-1">
                <Row className={`justify-content-${direction === "out" ? "end" : "start"}`}>
                    <Col sm="8" md="7" lg="6" className="rounded p-2" style={{backgroundColor: direction === "out" ? "#cdf3f2" : "#e9fafa"}}>
                        {message.text}
                        <p className="text-muted small mb-0"><Clock /> <When date={message.created_at} /></p>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    </li>
    );

}
