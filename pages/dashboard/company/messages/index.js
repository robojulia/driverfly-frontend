
import { Navbar, Container, Row, Col, Card, Button, FormGroup } from "react-bootstrap";
import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import useRedirect from '../../../../hooks/useRedirect';
import React, { useEffect, useState } from "react";

import {PenFill, TrashFill, Eye, EyeFill, Clock} from 'react-bootstrap-icons';

import Link from "next/link";

import { useTranslation } from "../../../../hooks/useTranslation";
import { useRouter } from "next/router";

/**
 * @type {ConversationEntity[]}
 */
const CONVERSATION_LIST_PROTO = [];

export default function MessageList() {

    const { authCompany } = useRedirect();

    authCompany()

    const { t } = useTranslation();
    const router = useRouter()
    const [conversations, setConversations] = useState(CONVERSATION_LIST_PROTO)

    useEffect(async () => {
        // const api = new JobApi();

        // const v = await api.list();

        // setJobs(v);
    }, []);

    return (
        <>
        <Row>
            <Col md="6" lg="5" xl="4" className="mb-4 mb-md-0">
                <h4 class="font-weight-bold mb-3 text-center text-lg-start">{t("MESSAGES")}</h4>
                <Card>
                    <Card.Body>
                        <Navbar expand="lg">
                            <Navbar.Toggle aria-controls="convo-navbar-nav " className=" w-100">
                                <div className="d-flex justify-content-between text-start">
                                    <div className="pt-1">
                                        <p className="fw-bold mb-0">John Doe</p>
                                        <p className="small text-muted">Hello, Are you there?</p>
                                    </div>
                                    <div className="pt-1">
                                        <p className="small text-muted mb-1">Just now</p>
                                        <span className="badge bg-danger float-end">1</span>
                                    </div>
                                </div>
                            </Navbar.Toggle>
                            <Navbar.Collapse id="convo-navbar-nav">
                                <ul className="list-unstyled mb-0 w-100" style={{ overflowY: "auto", height: "50vh" }}>
                                    <li className="p-2 border-bottom" style={{ backgroundColor: "#eee" }}>
                                        <a href="#!" className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                {/*
                                                // reserved in case we want to add profile pics later
                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp" alt="avatar"
                                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60" />
                                                */}
                                                <div className="pt-1">
                                                    <p className="fw-bold mb-0">John Doe</p>
                                                    <p className="small text-muted">Hello, Are you there?</p>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <p className="small text-muted mb-1">Just now</p>
                                                <span className="badge bg-danger float-end">1</span>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="p-2 border-bottom" style={{ backgroundColor: "#eee" }}>
                                        <a href="#!" className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                {/*
                                                // reserved in case we want to add profile pics later
                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp" alt="avatar"
                                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60" />
                                                */}
                                                <div className="pt-1">
                                                    <p className="fw-bold mb-0">John Doe</p>
                                                    <p className="small text-muted">Hello, Are you there?</p>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <p className="small text-muted mb-1">Just now</p>
                                                <span className="badge bg-danger float-end">1</span>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="p-2 border-bottom" style={{ backgroundColor: "#eee" }}>
                                        <a href="#!" className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                {/*
                                                // reserved in case we want to add profile pics later
                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp" alt="avatar"
                                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60" />
                                                */}
                                                <div className="pt-1">
                                                    <p className="fw-bold mb-0">John Doe</p>
                                                    <p className="small text-muted">Hello, Are you there?</p>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <p className="small text-muted mb-1">Just now</p>
                                                <span className="badge bg-danger float-end">1</span>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="p-2 border-bottom" style={{ backgroundColor: "#eee" }}>
                                        <a href="#!" className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                {/*
                                                // reserved in case we want to add profile pics later
                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp" alt="avatar"
                                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60" />
                                                */}
                                                <div className="pt-1">
                                                    <p className="fw-bold mb-0">John Doe</p>
                                                    <p className="small text-muted">Hello, Are you there?</p>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <p className="small text-muted mb-1">Just now</p>
                                                <span className="badge bg-danger float-end">1</span>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="p-2 border-bottom" style={{ backgroundColor: "#eee" }}>
                                        <a href="#!" className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                {/*
                                                // reserved in case we want to add profile pics later
                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp" alt="avatar"
                                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60" />
                                                */}
                                                <div className="pt-1">
                                                    <p className="fw-bold mb-0">John Doe</p>
                                                    <p className="small text-muted">Hello, Are you there?</p>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <p className="small text-muted mb-1">Just now</p>
                                                <span className="badge bg-danger float-end">1</span>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="p-2 border-bottom" style={{ backgroundColor: "#eee" }}>
                                        <a href="#!" className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                {/*
                                                // reserved in case we want to add profile pics later
                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp" alt="avatar"
                                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60" />
                                                */}
                                                <div className="pt-1">
                                                    <p className="fw-bold mb-0">John Doe</p>
                                                    <p className="small text-muted">Hello, Are you there?</p>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <p className="small text-muted mb-1">Just now</p>
                                                <span className="badge bg-danger float-end">1</span>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="p-2 border-bottom" style={{ backgroundColor: "#eee" }}>
                                        <a href="#!" className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                {/*
                                                // reserved in case we want to add profile pics later
                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp" alt="avatar"
                                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60" />
                                                */}
                                                <div className="pt-1">
                                                    <p className="fw-bold mb-0">John Doe</p>
                                                    <p className="small text-muted">Hello, Are you there?</p>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <p className="small text-muted mb-1">Just now</p>
                                                <span className="badge bg-danger float-end">1</span>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="p-2 border-bottom" style={{ backgroundColor: "#eee" }}>
                                        <a href="#!" className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                {/*
                                                // reserved in case we want to add profile pics later
                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp" alt="avatar"
                                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60" />
                                                */}
                                                <div className="pt-1">
                                                    <p className="fw-bold mb-0">John Doe</p>
                                                    <p className="small text-muted">Hello, Are you there?</p>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <p className="small text-muted mb-1">Just now</p>
                                                <span className="badge bg-danger float-end">1</span>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="p-2 border-bottom" style={{ backgroundColor: "#eee" }}>
                                        <a href="#!" className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                {/*
                                                // reserved in case we want to add profile pics later
                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp" alt="avatar"
                                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60" />
                                                */}
                                                <div className="pt-1">
                                                    <p className="fw-bold mb-0">John Doe</p>
                                                    <p className="small text-muted">Hello, Are you there?</p>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <p className="small text-muted mb-1">Just now</p>
                                                <span className="badge bg-danger float-end">1</span>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="p-2 border-bottom" style={{ backgroundColor: "#eee" }}>
                                        <a href="#!" className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                {/*
                                                // reserved in case we want to add profile pics later
                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp" alt="avatar"
                                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60" />
                                                */}
                                                <div className="pt-1">
                                                    <p className="fw-bold mb-0">John Doe</p>
                                                    <p className="small text-muted">Hello, Are you there?</p>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <p className="small text-muted mb-1">Just now</p>
                                                <span className="badge bg-danger float-end">1</span>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="p-2 border-bottom" style={{ backgroundColor: "#eee" }}>
                                        <a href="#!" className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                {/*
                                                // reserved in case we want to add profile pics later
                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp" alt="avatar"
                                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60" />
                                                */}
                                                <div className="pt-1">
                                                    <p className="fw-bold mb-0">John Doe</p>
                                                    <p className="small text-muted">Hello, Are you there?</p>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <p className="small text-muted mb-1">Just now</p>
                                                <span className="badge bg-danger float-end">1</span>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="p-2 border-bottom" style={{ backgroundColor: "#eee" }}>
                                        <a href="#!" className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                {/*
                                                // reserved in case we want to add profile pics later
                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp" alt="avatar"
                                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60" />
                                                */}
                                                <div className="pt-1">
                                                    <p className="fw-bold mb-0">John Doe</p>
                                                    <p className="small text-muted">Hello, Are you there?</p>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <p className="small text-muted mb-1">Just now</p>
                                                <span className="badge bg-danger float-end">1</span>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="p-2 border-bottom" style={{ backgroundColor: "#eee" }}>
                                        <a href="#!" className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                {/*
                                                // reserved in case we want to add profile pics later
                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp" alt="avatar"
                                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60" />
                                                */}
                                                <div className="pt-1">
                                                    <p className="fw-bold mb-0">John Doe</p>
                                                    <p className="small text-muted">Hello, Are you there?</p>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <p className="small text-muted mb-1">Just now</p>
                                                <span className="badge bg-danger float-end">1</span>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="p-2 border-bottom" style={{ backgroundColor: "#eee" }}>
                                        <a href="#!" className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                {/*
                                                // reserved in case we want to add profile pics later
                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp" alt="avatar"
                                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60" />
                                                */}
                                                <div className="pt-1">
                                                    <p className="fw-bold mb-0">John Doe</p>
                                                    <p className="small text-muted">Hello, Are you there?</p>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <p className="small text-muted mb-1">Just now</p>
                                                <span className="badge bg-danger float-end">1</span>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="p-2 border-bottom" style={{ backgroundColor: "#eee" }}>
                                        <a href="#!" className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                {/*
                                                // reserved in case we want to add profile pics later
                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp" alt="avatar"
                                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60" />
                                                */}
                                                <div className="pt-1">
                                                    <p className="fw-bold mb-0">John Doe</p>
                                                    <p className="small text-muted">Hello, Are you there?</p>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <p className="small text-muted mb-1">Just now</p>
                                                <span className="badge bg-danger float-end">1</span>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="p-2 border-bottom" style={{ backgroundColor: "#eee" }}>
                                        <a href="#!" className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                {/*
                                                // reserved in case we want to add profile pics later
                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp" alt="avatar"
                                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60" />
                                                */}
                                                <div className="pt-1">
                                                    <p className="fw-bold mb-0">John Doe</p>
                                                    <p className="small text-muted">Hello, Are you there?</p>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <p className="small text-muted mb-1">Just now</p>
                                                <span className="badge bg-danger float-end">1</span>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="p-2 border-bottom" style={{ backgroundColor: "#eee" }}>
                                        <a href="#!" className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                {/*
                                                // reserved in case we want to add profile pics later
                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp" alt="avatar"
                                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60" />
                                                */}
                                                <div className="pt-1">
                                                    <p className="fw-bold mb-0">John Doe</p>
                                                    <p className="small text-muted">Hello, Are you there?</p>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <p className="small text-muted mb-1">Just now</p>
                                                <span className="badge bg-danger float-end">1</span>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="p-2 border-bottom" style={{ backgroundColor: "#eee" }}>
                                        <a href="#!" className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                {/*
                                                // reserved in case we want to add profile pics later
                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp" alt="avatar"
                                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60" />
                                                */}
                                                <div className="pt-1">
                                                    <p className="fw-bold mb-0">John Doe</p>
                                                    <p className="small text-muted">Hello, Are you there?</p>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <p className="small text-muted mb-1">Just now</p>
                                                <span className="badge bg-danger float-end">1</span>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="p-2 border-bottom" style={{ backgroundColor: "#eee" }}>
                                        <a href="#!" className="d-flex justify-content-between">
                                            <div className="d-flex flex-row">
                                                {/*
                                                // reserved in case we want to add profile pics later
                                                <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp" alt="avatar"
                                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60" />
                                                */}
                                                <div className="pt-1">
                                                    <p className="fw-bold mb-0">John Doe</p>
                                                    <p className="small text-muted">Hello, Are you there?</p>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <p className="small text-muted mb-1">Just now</p>
                                                <span className="badge bg-danger float-end">1</span>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </Navbar.Collapse>

                        </Navbar>
                        <Button className="w-100" variant="primary">+ Create New Message</Button>
                        <Button className="w-100 mt-2" variant="primary">+ Set Up SMS Campaign</Button>
                        <Button className="w-100 mt-2" variant="primary">+ Create Report</Button>
                    </Card.Body>
                </Card>
            </Col>
            <Col md="6" lg="7" xl="8">
                <ul className="list-unstyled" style={{ overflowY: "auto", height: "50vh" }}>
                    <li className="d-flex justify-content-between">
                        <Card className="w-100">
                            <Card.Header className="d-flex justify-content-end p-3">
                                <p className="fw-bold mb-0">Lara Croft</p>
                            </Card.Header>
                            <Card.Body>
                                <Row className="justify-content-end">
                                    <Col sm="8" md="7" lg="6" className="rounded p-2" style={{backgroundColor: "#cdf3f2"}}>
                                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                                        laudantium.
                                        <p className="text-muted small mb-0"><Clock /> 13 mins ago</p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </li>
                    <li className="d-flex justify-content-between">
                        <Card className="w-100">
                            <Card.Header className="d-flex justify-content-start p-3">
                                <p className="fw-bold mb-0">Brad Pitt</p>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col sm="8" md="7" lg="6" className="rounded p-2" style={{backgroundColor: "#e9fafa"}}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                                        labore et dolore magna aliqua.
                                        <p className="text-muted small mb-0"><Clock /> 10 mins ago</p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </li>
                </ul>
                <form className="form-outline">
                    <textarea className="form-control" placeholder="Message" rows="2"></textarea>
                    <button type="button" className="btn btn-info float-end">Send</button>
                </form>
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
