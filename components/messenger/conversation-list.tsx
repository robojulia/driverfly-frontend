import { Col } from 'react-bootstrap';
import { Archive } from 'react-bootstrap-icons';
import { useTranslation } from '../../hooks/use-translation';
import { ConversationEntity } from '../../models/conversation/conversation.entity';
import OverlyPopover from '../popover/overly-popover';
import When from '../view-details/when';

export interface ConversationListProps {
  items?: ConversationEntity[];
  selected?: ConversationEntity;
  conversationPhones?: Map<number, string>;
  formatPhoneNumber?: (phone: string) => string;
  onItemClick?: (e: ConversationEntity) => void;
  onItemDelete?: (e: ConversationEntity) => void;
}

export function ConversationList(props: ConversationListProps) {
  const { items, selected, conversationPhones, formatPhoneNumber, onItemClick, onItemDelete } =
    props;

  const { t } = useTranslation();

  if (items?.length == 0) {
    return (
      <span className="text-center w-100">
        {t('NO_{name}_FOUND', { name: 'CONVERSATIONS' }, { translateProps: true })}
      </span>
    );
  }

  return (
    <ul className="list-unstyled mb-0 w-100 pt-3" style={{ overflowY: 'auto', height: '50vh' }}>
      {items?.filter(Boolean)?.map((c) => (
        <li key={c?.id} className="p-2 d-flex justify-content-between border-top">
          <Col
            className="hover-grey rounded mt-1"
            onClick={() => onItemClick(c)}
            style={{
              backgroundColor: c?.id != selected?.id ? '#fff' : '#eee',
              cursor: 'pointer',
            }}
          >
            <ConversationListItem
              entity={c}
              phoneNumber={conversationPhones?.get(c.id)}
              formatPhoneNumber={formatPhoneNumber}
            />
          </Col>
          {onItemDelete && (
            <OverlyPopover str="ARCHIVE_CONVERSATIONS" placement="right-start">
              <Archive
                title="ARCHIVE_CONVERSATIONS"
                className="ml-1 mt-2"
                role="button"
                color="red"
                onClick={(e) => onItemDelete(c)}
              />
            </OverlyPopover>
          )}
        </li>
      ))}
    </ul>
  );
}

export interface ConversationListItemProps {
  entity: ConversationEntity;
  phoneNumber?: string;
  formatPhoneNumber?: (phone: string) => string;
}

export function ConversationListItem(props: ConversationListItemProps) {
  const { entity, phoneNumber, formatPhoneNumber } = props;
  return (
    <div className="d-flex justify-content-between">
      <div className="d-flex flex-row">
        <div className="pt-1">
          <p className={`fw-bold mb-0 ${entity.unread > 0 && 'text-theme'}`}>
            {entity.chattable_name}
            {phoneNumber && formatPhoneNumber && (
              <small className="text-muted ms-2">{formatPhoneNumber(phoneNumber)}</small>
            )}
          </p>
          {entity.lastMessage && (
            <div className="small text-muted">
              <OverlyPopover
                slice_at={entity.lastMessage.text.length > 70 ? 70 : 0}
                str={entity?.lastMessage?.text}
              />
            </div>
          )}
        </div>
      </div>
      <div className="pt-1">
        {entity.lastMessage && (
          <p className="small text-muted mb-1">
            <When date={entity.lastMessage.created_at} />
          </p>
        )}
        {entity.lastMessage && entity.unread > 0 && (
          <span className="badge bg-danger float-end">{entity.unread}</span>
        )}
      </div>
    </div>
  );
}
