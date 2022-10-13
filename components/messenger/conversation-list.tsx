import { XCircle } from "react-bootstrap-icons";
import { useTranslation } from "../../hooks/useTranslation";
import { ConversationEntity } from "../../models/conversation/conversation.entity";
import When from "../viewDetails/when";

export interface ConversationListProps {
    items?: ConversationEntity[];
    selected?: ConversationEntity;
    onItemClick?: (e: ConversationEntity) => void;
    onItemDelete?: (e: ConversationEntity) => void;
}


export function ConversationList(props: ConversationListProps) {
    const { items, selected, onItemClick, onItemDelete } = props;

    const { t } = useTranslation();

    console.log("ConversationList Items", items);

    if (items?.length == 0) {
        return (<span className="text-center w-100">{t("NO_{name}_FOUND", { name: "CONVERSATIONS" }, { translateProps: true })}</span>);
    }

    return (
    <ul className="list-unstyled mb-0 w-100" style={{ overflowY: "auto", height: "50vh" }}>
        {
            items.map(c => (
            <li key={c.id} className="p-2 border-bottom" style={{ backgroundColor: c.id === selected?.id ? "#fff" : "#eee", cursor: "pointer" }} onClick={e => onItemClick(c)}>
                <ConversationListItem entity={c} onDelete={onItemDelete} />
            </li>
            ))
        }
    </ul>);
}

export interface ConversationListItemProps {
    entity: ConversationEntity;
    onDelete?: (e: ConversationEntity) => void;
}

export function ConversationListItem(props: ConversationListItemProps) {
    const { entity, onDelete } = props;

    return (
        <div className="d-flex justify-content-between text-start">
            <div className="pt-1">
                <p className="fw-bold mb-0">{entity.chattable_name}</p>
                {
                    entity.lastMessage &&
                    <p title={entity.lastMessage.text} className="small text-muted text-truncate" style={{ width: "200px"}}>{entity.lastMessage.text}</p>
                }
            </div>
            <div className="pt-1">
                {
                    entity.lastMessage &&
                    <p className="small text-muted mb-1"><When date={entity.lastMessage.created_at} /></p>
                }
                {
                    entity.lastMessage && entity.unread > 0 &&
                    <span className="badge bg-danger float-end">{entity.unread}</span>
                }
            </div>
            {onDelete && <XCircle color="red" onClick={e => onDelete(entity)} />}
        </div>
     );

}