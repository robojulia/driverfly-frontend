import axios, { CancelTokenSource } from "axios";
import { useFormik } from "formik";
import React from "react";
import { useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { ChattableType } from "../../enums/conversation/chattable-type.enum";
import { useTranslation } from "../../hooks/useTranslation";
import { ConversationEntity, CreateConversationDto } from "../../models/conversation/conversation.entity";
import { ConversationApi } from "../../pages/api/conversation";
import { globalAjaxExceptionHandler } from "../../utils/ajax";
import ComboBox, { ComboboxItem } from "../controls/combobox";
import BaseTextArea from "../forms/BaseTextArea";
import { Message } from "./message";

export interface ConversationFormProps {
    entity?: ConversationEntity;
    canCreate?: boolean;
    onCreated?: (e: ConversationEntity) => void;
    onUpdated?: (e: ConversationEntity) => void;
    onConversationToChange?: (e: CreateConversationDto) => void;
    getOptions?: (query: string, cancellationToken: CancelTokenSource) => Promise<ComboboxItem[]>;
}

export function ConversationForm(props: ConversationFormProps) {
    const { entity, canCreate, onCreated, onUpdated, onConversationToChange, getOptions } = props;

    const { t } = useTranslation();

    const form = useFormik({
        initialValues: new ConversationEntity.CreateDto(),
        validationSchema: ConversationEntity.CreateDto.yupSchema(),
        onSubmit: async (dto) => {
            const api = new ConversationApi();

            let convo: ConversationEntity = {
                ...entity,
                messages: [
                    ...entity.messages || []
                ]
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
                    text: dto.message
                });
                convo.messages.push(convo.lastMessage);

                if (entity.id) {
                    if (onUpdated) onUpdated(convo);
                } else {
                    if (onCreated) onCreated(convo);
                }

               form.setValues({
                   ...dto,
                   message: null
               }, false);
           } catch (e) {
               console.error("Unable to save convo info", e);

               globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast });
           }
        }
    });

    useEffect(() => {
        // form.initialValues = {
        //     ...form.initialValues,
        //     chattable_type: entity?.chattable_type,
        //     chattable_name: entity?.chattable_name,
        //     chattable_id: entity?.chattable_id,
        //     message: null,
        // };
        form.setValues({
            ...form.values,
            chattable_type: entity?.chattable_type,
            chattable_name: entity?.chattable_name,
            chattable_id: entity?.chattable_id,
            message: null,
        });

    }, [ entity ]);

    const [ cancelTokenSource, setCancelTokenSource] = useState(null);

    const getOptionsProxy = async (query) => {
       if (cancelTokenSource)
           cancelTokenSource.cancel("New search results posted");

       let tokenSource = axios.CancelToken.source();
       setCancelTokenSource(tokenSource);

       try {
           return await getOptions(query, tokenSource);
       }
       catch (e) {
           if (axios.isCancel(e)) {
               console.warn("cancelled?", e);
               return [];
           }

           throw e;
       }
    };

    const onConversationToChangeProxy = e => {
        const { name, value } = e.target;

        form.setValues({
            ...form.values,
            chattable_type: value?.chattable_type,
            chattable_id: value?.chattable_id,
            chattable_name: value?.chattable_name,
        });

        if (onConversationToChange) onConversationToChange(form.values);
   }

   const lastMessage = React.createRef<HTMLLIElement>();

   useEffect(() => lastMessage.current?.scrollIntoView({ behavior: "smooth" }), [lastMessage])

   return (
    <Card>
        <Card.Header>
            {(() => {
                if (entity.id) return entity.chattable_name;
                
                if (canCreate) return (
                    <>
                    <ComboBox options={getOptionsProxy} onChange={onConversationToChangeProxy} minLength={3} />
                    {typeof form.errors?.chattable_id === "string" &&
                    <span className="text-danger small">{t(form.errors.chattable_id)}</span>
                    }
                    </>
                );

                return t("NONE");
            })()}
        </Card.Header>
        <Card.Body>
            <ul className="list-unstyled" style={{ overflowY: "auto", height: "50vh" }}>
                {
                    entity?.messages?.map((m, i, a) => (
                        <Message key={m.id} conversation={entity} message={m} showHeader={m.direction !== a[i - 1]?.direction} lastMessageRef={i == entity.messages.length - 1 ? lastMessage : null} />
                    ))
                }
            </ul>
        </Card.Body>
        {
            (entity.id || canCreate) && 
            <Card.Footer>
                <Form className="form-outline" onSubmit={form.handleSubmit}>
                    <BaseTextArea
                        name="message"
                        formik={form}
                        readOnly={!entity.id && !canCreate}
                        required
                        placeholder="MESSAGE" />
                    <button type="submit" className="btn btn-info float-end">{t("SEND")}</button>
                </Form>
            </Card.Footer>
        }
    </Card>
    );
}