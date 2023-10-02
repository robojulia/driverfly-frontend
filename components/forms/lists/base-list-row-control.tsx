import { Button, InputGroup, Row, Col } from "react-bootstrap";
import { DashCircle } from "react-bootstrap-icons";

export interface BaseListRowControlProps {
    index: number;
    onRemoveClick: (idx: number, e?: React.MouseEvent<HTMLButtonElement>) => void;
    readonly children: React.ReactChild | React.ReactChild[];
}

export function BaseListRowControl(props: BaseListRowControlProps) {
    const { index, children, onRemoveClick } = props;

    return (
        <Row className="mt-1">
            <Col>
                <InputGroup className="flex-nowrap border rounded">
                    <div className="input-group-prepend">
                        <InputGroup.Text>{index + 1}</InputGroup.Text>
                    </div>
                    {children}
                    <div className="input-group-append " style={{ height: "38px" }}>
                        <Button variant="outline-danger close_btn" name={index.toString()} onClick={(e) => onRemoveClick(index, e)}><DashCircle /></Button>
                    </div>
                </InputGroup>
            </Col>
        </Row >
    );
}