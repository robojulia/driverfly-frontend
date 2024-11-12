import axios, { CancelTokenSource } from "axios";
import { useFormik } from "formik";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Card, Col, Collapse, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { ApplicantDocumentType } from "../../enums/applicants/applicant-document-type.enum";
import { UserPreferenceCommunicationLabel } from "../../enums/users/user-preferences-communication-label.enum";
import useStorage from "../../hooks/use-storage";
import { useTranslation } from "../../hooks/use-translation";
import { ApplicantEntity } from "../../models/applicant";
import {
    ConversationEntity,
    CreateConversationDto,
} from "../../models/conversation/conversation.entity";
import { UserPreferenceEntity } from "../../models/user/user-preference.entity";
import { ConversationApi } from "../../pages/api/conversation";
import { globalAjaxExceptionHandler } from "../../utils/ajax";
import { buildArrayQueryString } from "../../utils/common";
import ComboBox, { ComboboxItem } from "../controls/combobox";
import BaseTextArea from "../forms/base-text-area";
import { LoaderIcon } from "../loading/loader-icon";
import { Message } from "./message";
import { useAuth } from "../../hooks/use-auth";

export interface ConversationFormProps {
    entity?: ConversationEntity;
    userPreferences?: UserPreferenceEntity[];
    canCreate?: boolean;
    onCreated?: (e: ConversationEntity) => void;
    onUpdated?: (e: ConversationEntity) => void;
    onConversationToChange?: (e: CreateConversationDto) => void;
    getOptions?: (
        query: string,
        cancellationToken: CancelTokenSource
    ) => Promise<ComboboxItem[]>;
    applicant?: ApplicantEntity;
}

export function ConversationForm(props: ConversationFormProps) {
    const {
        entity,
        canCreate,
        onCreated,
        onUpdated,
        onConversationToChange,
        getOptions,
        userPreferences,
    } = props;

    const { t } = useTranslation();

    const { user } = useAuth();
    const {
        getItem: getDraft,
        setItem: setDraft,
        removeItem: removeDraft,
    } = useStorage();

    // const [canAttach, setCanAttach] = useState<boolean>(false);
    // const enableAttachments = (): void => setCanAttach(true);
    // const disableAttachments = (): void => {
    //     setCanAttach(false);
    //     setDocumentTypes([]);
    // };

    const [documentTypes, setDocumentTypes] = useState<ApplicantDocumentType[]>(
        []
    );
    // const handleMissingDocumentChange = ({
    //     target: { value },
    // }: ChangeEvent<HTMLInputElement>): void => {
    //     setDocumentTypes(
    //         documentTypes.includes(value as ApplicantDocumentType)
    //             ? documentTypes.filter((t) => t != value)
    //             : [...documentTypes, value as ApplicantDocumentType]
    //     );
    // };

    const api = new ConversationApi();
    const form = useFormik({
        validateOnChange: false,
        validateOnBlur: false,
        initialValues: new ConversationEntity.CreateDto(),
        validationSchema: ConversationEntity.CreateDto.yupSchema(),
        onSubmit: async (dto) => {
            let convo: ConversationEntity = {
                ...entity,
                messages: [...(entity.messages || [])],
            };
            try {
                if (!entity.id) {
                    convo = await api.create({
                        chattable_type: dto.chattable_type,
                        chattable_name: dto.chattable_name,
                        chattable_id: dto.chattable_id,
                    });

                    convo.messages = await api.messages.list(convo.id);
                }

                convo.lastMessage = await api.messages.create(convo.id, {
                    text: dto.message,
                });
                convo.messages.push(convo.lastMessage);

                if (entity.id) {
                    if (onUpdated) onUpdated(convo);
                } else {
                    if (onCreated) onCreated(convo);
                }

                form.setValues(
                    {
                        ...dto,
                        message: null,
                    },
                    false
                );
                removeDraft(`draft_user_${user.id}_${entity.chattable_type}_${entity.chattable_id}`)
                // disableAttachments();
            } catch (e) {
                console.error("Unable to save convo info", e);

                globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast });
            }
        },
    });

    useEffect(() => {
        const { chattable_id, chattable_name, chattable_type } = entity;
        const value = getDraft(`draft_user_${user.id}_${entity.chattable_type}_${entity.chattable_id}`)

        form.setValues({
            ...form.values,
            chattable_id,
            chattable_name,
            chattable_type,
            message: value
        });
    }, [entity]);

    const [cancelTokenSource, setCancelTokenSource] = useState(null);

    const getOptionsProxy = async (query) => {
        if (cancelTokenSource)
            cancelTokenSource.cancel("New search results posted");

        let tokenSource = axios.CancelToken.source();
        setCancelTokenSource(tokenSource);

        try {
            return await getOptions(query, tokenSource);
        } catch (e) {
            if (axios.isCancel(e)) {
                console.warn("cancelled?", e);
                return [];
            }

            throw e;
        }
    };

    const onConversationToChangeProxy = (e) => {
        const { name, value } = e.target;
        const values = {
            ...form.values,
            chattable_type: value?.chattable_type,
            chattable_id: value?.chattable_id,
            chattable_name: value?.chattable_name,
            message: getDraft(`draft_user_${user.id}_${entity.chattable_type}_${entity.chattable_id}`) || ""
        }
        form.setValues(values);

        if (onConversationToChange) onConversationToChange(values);
    };

    const lastMessage = React.createRef<HTMLLIElement>();

    useEffect(
        () => lastMessage.current?.scrollIntoView({ behavior: "smooth" }),
        [lastMessage]
    );

    const PreferredHours = () => {
        const hours = userPreferences?.find(
            (v) => v.label == UserPreferenceCommunicationLabel.PREFERRED_HOURS
        )?.value;

        return hours ? (
            <>{`${hours?.start}-${hours?.end}`}</>
        ) : (
            <>{t("NOT_SPECIFIED")}</>
        );
    };

    // useEffect(() => {
    //     console.log("form.values, form.errors", form.values, form.errors);
    // }, [form.values, form.errors]);

    // useEffect(() => {
    //     console.log("useEffect props?.applicant", props?.applicant);
    // }, [props?.applicant]);

    useEffect(() => {
        // console.log("props?.applicant", props?.applicant);
        if (!!documentTypes?.length) {
            const link: string = `${process.env.FRONTEND_BASE_URL}form/applicant/${props?.applicant?.uuid_token
                }/documents?${buildArrayQueryString("type", documentTypes)}`;

            const documents: string = documentTypes
                .map((type) => t(`ApplicantDocumentType.${type}`))
                .join(",");
            const message = `${t(
                "REQUEST_{name}_FOR_MISSING_{documents}_MESSAGE_WITH_{link}_{hv}",
                {
                    name: `${props.applicant.first_name ?? ""} ${props.applicant.last_name ?? ""
                        }`,
                    documents,
                    link,
                    hv: documentTypes.length == 1 ? "IS" : "ARE",
                },
                { translateProps: true }
            )}`;
            form.setFieldValue("message", message);
        } else {
            form.setFieldValue("message", null);
        }
    }, [documentTypes]);

    return (
        <Card>
            <Card.Header style={{ cursor: "default", color: 'black' }} >
                {(() => {
                    if (entity.id) return (
                        <>
                            <>{entity.chattable_name}</> <br />
                            <small>
                                <b>{t("PREFERRED_HOURS")}: </b>
                                {<PreferredHours />}
                            </small>
                        </>
                    );

                    if (canCreate) return (
                        <>
                            <ComboBox
                                options={getOptionsProxy}
                                onChange={onConversationToChangeProxy}
                                minLength={3}
                            />
                            {typeof form.errors?.chattable_id == "string" && (
                                <span className="text-danger small">
                                    {t(form.errors.chattable_id)}
                                </span>
                            )}
                        </>
                    );

                    return t("NONE");
                })()}
            </Card.Header>
            {Boolean(entity.lastMessage) && (
                <Card.Body>
                    <ul
                        className="list-unstyled"
                        style={{ overflowY: "auto", height: "50vh" }}
                    >
                        {entity?.messages?.map((m, i, a) => (
                            <Message
                                key={m.id}
                                conversation={entity}
                                message={m}
                                showHeader={m.direction != a[i - 1]?.direction}
                                lastMessageRef={
                                    i == entity.messages.length - 1 ? lastMessage : null
                                }
                            />
                        ))}
                    </ul>
                </Card.Body>
            )}

            {(entity.id || canCreate) && (
                form.values?.chattable_name && (
                    <Card.Footer>
                        <Form className="form-outline" onSubmit={form.handleSubmit}>
                            <Row>
                                <Col md={10}>
                                    {/* <Collapse in={!!!canAttach}> */}
                                    <div id="collapse-text">
                                        <BaseTextArea
                                            name="message"
                                            formik={form}
                                            readOnly={!entity.id && !canCreate}
                                            required
                                            placeholder="MESSAGE"
                                            onChange={({ target: { value } }) => {
                                                setDraft(`draft_user_${user.id}_${form.values.chattable_type}_${form.values.chattable_id}`, value)
                                                form.setFieldValue("message", value);
                                            }}
                                        />
                                        {/* {entity.chattable_type == ChattableType.APPLICANT && (
                                                <>
                                                    <BaseCheckList
                                                        className="mt-2"
                                                        readOnly
                                                        disabled
                                                        label="UPLOADED_DOCUMENTS"
                                                        enumType={ApplicantDocumentType}
                                                        value={props.applicant?.documents?.map(
                                                            (v) => v.type
                                                        )}
                                                    />
                                                </>
                                            )} */}
                                        {/* {props.applicant.uuid_token
                                                && props.applicant?.documents?.length != Object.keys(ApplicantDocumentType)?.length
                                                && (
                                                    <small
                                                        className="btn-link"
                                                        role="button"
                                                        onClick={enableAttachments}
                                                        aria-controls="collapse-select"
                                                        aria-expanded={!!canAttach}
                                                    >
                                                        {t("REQUEST_FOR_MISSING_DOCUMENTS")}
                                                    </small>
                                                )} */}
                                    </div>
                                    {/* </Collapse> */}
                                    {/* <Collapse in={!!canAttach}>
                                        <div id="collapse-select">
                                            <BaseCheckList
                                                labelPrefix="ApplicantDocumentType"
                                                label="REQUEST_FOR_MISSING_DOCUMENTS"
                                                options={Object.values(ApplicantDocumentType)
                                                    .filter(
                                                        (v) =>
                                                            !props.applicant?.documents
                                                                ?.map((doc) => doc.type)
                                                                ?.includes(v)
                                                    )
                                                    ?.map((value) => ({
                                                        label: value,
                                                        value: value as ApplicantDocumentType,
                                                    }))}
                                                value={documentTypes}
                                                onChange={handleMissingDocumentChange}
                                            />
                                            <small
                                                className="btn-link"
                                                role="button"
                                                onClick={disableAttachments}
                                                aria-controls="collapse-text"
                                                aria-expanded={!canAttach}
                                            >
                                                {t("CANCEL")}
                                            </small>
                                        </div>
                                    </Collapse> */}
                                </Col>
                                <Col md={2}>
                                    <div className="d-flex justify-content-center align-items-center h-100">
                                        <button
                                            disabled={form.isSubmitting}
                                            type="submit"
                                            className=" btn btn-info float-end"
                                        >
                                            {t("SEND")}
                                            <LoaderIcon isLoading={form.isSubmitting} />
                                        </button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Footer>
                )
            )}
        </Card>
    );
}
