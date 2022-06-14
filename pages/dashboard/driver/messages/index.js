import FullLayout from "../../../../components/dashboard/layouts/FullLayout";
import useRedirect from '../../../../hooks/useRedirect';
import { Container, Row, Col, Offcanvas, Button, Card, Navbar, Form } from 'react-bootstrap';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useEffect, useState } from 'react';
import { Plus } from "react-bootstrap-icons";
import BaseTextArea from "../../../../components/forms/BaseTextArea";

export default function Messages() {

    const { t } = useTranslation();
    const { authDriver } = useRedirect();
    authDriver()

    return (
        <>
            <div>
                <div class="Toastify">
                </div>
                <Row>
                    <Col md="6" lg="5" xl="4" className="mb-4 mb-md-0">
                        <h4 class="font-weight-bold mb-3 text-center text-lg-start">{t("MESSAGES")}</h4>
                        <Card>
                            <Card.Body>
                                <Navbar expand="lg">
                                    <Navbar.Toggle aria-controls="convo-navbar-nav " className="w-100">
                                    </Navbar.Toggle>
                                    <Navbar.Collapse id="convo-navbar-nav">

                                        <ul className="list-unstyled mb-0 w-100" style={{ overflowY: "auto", height: "3vh" }}>
                                            <div className="text-center w-100">{t("NO_{name}_FOUND", { name: "CONVERSATIONS" }, { translateProps: true })}</div>
                                        </ul>

                                    </Navbar.Collapse>
                                </Navbar>
                                <Button className="w-100 mt-1" variant="primary"><Plus /> {t("CREATE_NEW_MESSAGE")}</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="6" lg="7" xl="8">
                        <Card>
                            <Form>
                                <Card.Header>
                                    <div class="dropdown">
                                        <input placeholder="Type at least 3 characters to see options" autocomplete="off" type="text" class="form-control" />
                                    </div>

                                </Card.Header>
                                <Card.Body>
                                    <ul className="list-unstyled" style={{ overflowY: "auto", height: "50vh" }}>
                                    </ul>
                                </Card.Body>
                                <Card.Footer>
                                    <form className="form-outline">
                                        <BaseTextArea
                                            name="message"
                                            required
                                            placeholder="MESSAGE" />
                                        <button type="submit" className="btn btn-info float-end" >{t("SEND")}</button>
                                    </form>
                                </Card.Footer>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
};

Messages.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}