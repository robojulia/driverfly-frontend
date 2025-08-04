import { useTranslation } from '../../hooks/use-translation';
import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { X, XLg } from 'react-bootstrap-icons';

export interface ViewModalProps {
  show?: boolean;
  title?: string;
  header?: string | JSX.Element | JSX.Element[];
  footer?: string | JSX.Element | JSX.Element[];
  closeText?: string;
  size?: 'sm' | 'lg' | 'xl';
  onCloseClick?: () => void;
  readonly children?: React.ReactChildren | React.ReactChild;
  className?: string;
  noCloseBtn?: boolean;
  headerClass?: string;
  bodyClass?: string;
  centered?: boolean;
}

export default function ViewModal(props: ViewModalProps) {
  const { t } = useTranslation();
  const [show, setShow] = useState(!!props.show);

  useEffect(() => {
    setShow(!!props.show);
  }, [props]);

  const hideModelHandler = () => {
    setShow(false);
  };

  return (
    <Modal
      show={show}
      size={props.size}
      onHide={props.onCloseClick ?? hideModelHandler}
      className={props.className}
      centered={props.centered}
    >
      <Modal.Header className={`justify-content-between ${props?.headerClass}`}>
        <div className="d-flex align-items-center">
          {props.title && (
            <h4 className="modal-title font-weight-normal">
              {typeof props.title == 'string' ? t(props.title) : props.title}
            </h4>
          )}
          {props.header}
        </div>
        {props?.noCloseBtn ? (
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={props.onCloseClick ?? hideModelHandler}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        ) : (
          <Button
            style={{ backgroundColor: 'grey', color: 'white' }}
            variant="theme-general-btn"
            onClick={props.onCloseClick ?? hideModelHandler}
          >
            <XLg /> {t(props.closeText || 'CLOSE')}
          </Button>
        )}
      </Modal.Header>
      <Modal.Body className={`${props?.bodyClass}`}>{props.children}</Modal.Body>
      {props.footer && <Modal.Footer>{props.footer}</Modal.Footer>}
    </Modal>
  );
}
