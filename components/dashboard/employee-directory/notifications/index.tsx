import { useState } from "react";
import { Button, Form, Modal, Badge, InputGroup, FormControl } from "react-bootstrap";
import { PlusCircle, Trash, PersonCircle, Envelope, ChatDots } from "react-bootstrap-icons";
import { useTranslation } from "../../../../hooks/use-translation";
import { EmployeeEntity } from "../../../../models/employee/employee.entity";

interface NotificationsProps {
    employee: EmployeeEntity;
    canEdit?: boolean;
}

interface NotificationRule {
    id: number;
    name: string;
    document: string;
    documentType: string;
    frequency: number;
    frequencyUnit: string;
    notificationMethods: ('email' | 'sms')[];
    recipients: string[];
    messageTemplate: string;
    followUpEnabled: boolean;
    followUpDays: number;
    notifyIfIncomplete: boolean;
    enabled: boolean;
}

export default function Notifications({ employee, canEdit = true }: NotificationsProps) {
    const { t } = useTranslation();

    // Global Settings State
    const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
    const [smsNotificationsEnabled, setSmsNotificationsEnabled] = useState(false);
    const [defaultEmail, setDefaultEmail] = useState("hr@company.com");
    const [defaultSmsNumber, setDefaultSmsNumber] = useState("+12345678901");

    // Notification Rules State
    const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([
        {
            id: 1,
            name: "License Expiration Warning",
            document: "Commercial Driver's License",
            documentType: "Commercial Driver's License",
            frequency: 30,
            frequencyUnit: "days",
            notificationMethods: ['email'],
            recipients: ["hr@company.com", "manager@company.com"],
            messageTemplate: "Driver license for {employee_name} expires in {days_remaining} days.",
            followUpEnabled: false,
            followUpDays: 7,
            notifyIfIncomplete: true,
            enabled: true,
        },
        {
            id: 2,
            name: "Medical Certificate Due",
            document: "Medical Certificate",
            documentType: "Medical Certificate",
            frequency: 2,
            frequencyUnit: "months",
            notificationMethods: ['email', 'sms'],
            recipients: ["hr@company.com"],
            messageTemplate: "Medical certificate renewal due for {employee_name}.",
            followUpEnabled: false,
            followUpDays: 0,
            notifyIfIncomplete: false,
            enabled: true,
        },
        {
            id: 3,
            name: "MVR Annual Review",
            document: "Motor Vehicle Record",
            documentType: "Motor Vehicle Record",
            frequency: 1,
            frequencyUnit: "years",
            notificationMethods: ['email'],
            recipients: ["hr@company.com"],
            messageTemplate: "Annual MVR review due for {employee_name}.",
            followUpEnabled: false,
            followUpDays: 0,
            notifyIfIncomplete: false,
            enabled: true,
        },
    ]);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingRule, setEditingRule] = useState<NotificationRule | null>(null);
    const [isNewRule, setIsNewRule] = useState(false);

    // Modal Form State
    const [modalFormData, setModalFormData] = useState<Partial<NotificationRule>>({
        name: "",
        document: "",
        documentType: "Other",
        frequency: 30,
        frequencyUnit: "days",
        notificationMethods: ['email'],
        recipients: [],
        messageTemplate: "",
        followUpEnabled: false,
        followUpDays: 1,
        notifyIfIncomplete: false,
        enabled: true,
    });

    const handleAddRule = () => {
        setIsNewRule(true);
        setEditingRule(null);
        setModalFormData({
            name: "",
            document: "",
            documentType: "Other",
            frequency: 30,
            frequencyUnit: "days",
            notificationMethods: ['email'],
            recipients: [],
            messageTemplate: "",
            followUpEnabled: false,
            followUpDays: 1,
            notifyIfIncomplete: false,
            enabled: true,
        });
        setShowModal(true);
    };

    const handleEditRule = (rule: NotificationRule) => {
        setIsNewRule(false);
        setEditingRule(rule);
        setModalFormData(rule);
        setShowModal(true);
    };

    const handleDeleteRule = (ruleId: number) => {
        if (window.confirm("Are you sure you want to delete this notification rule?")) {
            setNotificationRules(notificationRules.filter(rule => rule.id !== ruleId));
        }
    };

    const handleSaveRule = () => {
        if (isNewRule) {
            const newRule: NotificationRule = {
                ...modalFormData as NotificationRule,
                id: Math.max(...notificationRules.map(r => r.id), 0) + 1,
            };
            setNotificationRules([...notificationRules, newRule]);
        } else if (editingRule) {
            setNotificationRules(
                notificationRules.map(rule =>
                    rule.id === editingRule.id ? { ...modalFormData as NotificationRule, id: rule.id } : rule
                )
            );
        }
        setShowModal(false);
    };

    const handleToggleRule = (ruleId: number) => {
        setNotificationRules(
            notificationRules.map(rule =>
                rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
            )
        );
    };

    const handleAddRecipient = (recipient: string) => {
        if (recipient && !modalFormData.recipients?.includes(recipient)) {
            setModalFormData({
                ...modalFormData,
                recipients: [...(modalFormData.recipients || []), recipient],
            });
        }
    };

    const handleRemoveRecipient = (recipient: string) => {
        setModalFormData({
            ...modalFormData,
            recipients: modalFormData.recipients?.filter(r => r !== recipient) || [],
        });
    };

    const [recipientInput, setRecipientInput] = useState("");

    return (
        <div className="employee_directory_tabs">
            {/* Teal Header */}
            <div style={{
                background: 'linear-gradient(135deg, rgb(0, 96, 120) 0%, rgb(29, 67, 84) 100%)',
                borderRadius: '0.5rem',
                padding: '1.25rem 1.5rem',
                marginBottom: '1.5rem',
            }}>
                <div>
                    <h5 style={{ color: '#fff', margin: 0, fontWeight: 600, fontSize: '1.125rem' }}>
                        Compliance Notification Settings
                    </h5>
                </div>
            </div>

            {/* Global Notification Settings */}
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                border: '1px solid #dee2e6'
            }}>
                <h6 style={{ fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                    <span style={{
                        width: '8px',
                        height: '24px',
                        backgroundColor: 'rgb(0, 96, 120)',
                        marginRight: '0.75rem',
                        borderRadius: '2px'
                    }}></span>
                    Global Notification Settings
                </h6>

                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2 pb-2" style={{ borderBottom: '1px solid #e9ecef' }}>
                        <div>
                            <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>Email Notifications</div>
                            <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>Receive notifications via email</div>
                        </div>
                        <Form.Check
                            type="switch"
                            id="email-notifications-switch"
                            checked={emailNotificationsEnabled}
                            onChange={(e) => setEmailNotificationsEnabled(e.target.checked)}
                            disabled={!canEdit}
                            style={{ transform: 'scale(1.2)' }}
                        />
                    </div>

                    {emailNotificationsEnabled && (
                        <div className="ml-4 mb-3">
                            <Form.Group className="mb-0">
                                <Form.Label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Default Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={defaultEmail}
                                    onChange={(e) => setDefaultEmail(e.target.value)}
                                    disabled={!canEdit}
                                    size="sm"
                                    placeholder="email@company.com"
                                />
                            </Form.Group>
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2 pb-2" style={{ borderBottom: '1px solid #e9ecef' }}>
                        <div>
                            <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>SMS Notifications</div>
                            <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>Receive notifications via SMS</div>
                        </div>
                        <Form.Check
                            type="switch"
                            id="sms-notifications-switch"
                            checked={smsNotificationsEnabled}
                            onChange={(e) => setSmsNotificationsEnabled(e.target.checked)}
                            disabled={!canEdit}
                            style={{ transform: 'scale(1.2)' }}
                        />
                    </div>

                    {smsNotificationsEnabled && (
                        <div className="ml-4 mb-3">
                            <Form.Group className="mb-0">
                                <Form.Label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Default SMS Number</Form.Label>
                                <Form.Control
                                    type="tel"
                                    value={defaultSmsNumber}
                                    onChange={(e) => setDefaultSmsNumber(e.target.value)}
                                    disabled={!canEdit}
                                    size="sm"
                                    placeholder="+1234567890"
                                />
                            </Form.Group>
                        </div>
                    )}
                </div>
            </div>

            {/* Notification Rules Section */}
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                border: '1px solid #dee2e6'
            }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 style={{ fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center' }}>
                        <span style={{
                            width: '8px',
                            height: '24px',
                            backgroundColor: 'rgb(0, 96, 120)',
                            marginRight: '0.75rem',
                            borderRadius: '2px'
                        }}></span>
                        Notification Rules
                    </h6>
                    {canEdit && (
                        <Button
                            size="sm"
                            onClick={handleAddRule}
                            style={{
                                backgroundColor: 'rgb(0, 96, 120)',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <PlusCircle size={16} />
                            Add Rule
                        </Button>
                    )}
                </div>

                {notificationRules.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem 1rem',
                        color: '#6c757d'
                    }}>
                        <p>No notification rules configured yet.</p>
                        {canEdit && (
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={handleAddRule}
                            >
                                Create your first rule
                            </Button>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {notificationRules.map((rule) => (
                            <div
                                key={rule.id}
                                style={{
                                    border: '1px solid #dee2e6',
                                    borderRadius: '0.375rem',
                                    padding: '1rem',
                                    backgroundColor: rule.enabled ? '#fff' : '#f8f9fa',
                                    opacity: rule.enabled ? 1 : 0.7,
                                }}
                            >
                                <div className="d-flex justify-content-between align-items-start">
                                    <div style={{ flex: 1 }}>
                                        <div className="d-flex align-items-center mb-2">
                                            <h6 style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>
                                                {rule.name}
                                            </h6>
                                            <Badge
                                                bg={rule.documentType === "Commercial Driver's License" ? "primary" :
                                                   rule.documentType === "Medical Certificate" ? "success" : "info"}
                                                className="ml-2"
                                                style={{ fontSize: '0.7rem' }}
                                            >
                                                {rule.documentType}
                                            </Badge>
                                        </div>

                                        <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.75rem' }}>
                                            <div className="mb-1">
                                                <strong>Every {rule.frequency} {rule.frequencyUnit}</strong>
                                                {" "}
                                                <span style={{ margin: '0 0.5rem' }}>•</span>
                                                {rule.notificationMethods.map((method, idx) => (
                                                    <span key={idx}>
                                                        {method === 'email' ? <Envelope size={14} className="mr-1" /> : <ChatDots size={14} className="mr-1" />}
                                                        {method.toUpperCase()}
                                                        {idx < rule.notificationMethods.length - 1 ? ', ' : ''}
                                                    </span>
                                                ))}
                                            </div>
                                            <div style={{ fontStyle: 'italic', fontSize: '0.825rem' }}>
                                                "{rule.messageTemplate}"
                                            </div>
                                        </div>

                                        <div style={{ fontSize: '0.8rem', color: '#495057' }}>
                                            <strong>Recipients:</strong> {rule.recipients.join(", ")}
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
                                        <Form.Check
                                            type="switch"
                                            id={`rule-toggle-${rule.id}`}
                                            checked={rule.enabled}
                                            onChange={() => handleToggleRule(rule.id)}
                                            disabled={!canEdit}
                                        />
                                        {canEdit && (
                                            <Button
                                                variant="link"
                                                size="sm"
                                                onClick={() => handleDeleteRule(rule.id)}
                                                style={{ color: '#dc3545', padding: '0.25rem' }}
                                            >
                                                <Trash size={16} />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Save Settings Button */}
            <div className="d-flex justify-content-end mt-4">
                <Button
                    style={{
                        backgroundColor: 'rgb(0, 96, 120)',
                        border: 'none',
                        padding: '0.5rem 2rem'
                    }}
                    disabled={!canEdit}
                >
                    Save Settings
                </Button>
            </div>

            {/* Add/Edit Notification Rule Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid rgb(0, 96, 120)' }}>
                    <Modal.Title style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                        {isNewRule ? "Add Notification Rule" : "Edit Notification Rule"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: 500 }}>Document</Form.Label>
                            <Form.Select
                                value={modalFormData.documentType}
                                onChange={(e) => setModalFormData({ ...modalFormData, documentType: e.target.value })}
                            >
                                <option value="Other">Other</option>
                                <option value="Commercial Driver's License">Commercial Driver's License</option>
                                <option value="Medical Certificate">Medical Certificate</option>
                                <option value="Motor Vehicle Record">Motor Vehicle Record</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: 500 }}>Rule Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g., License Expiration Warning"
                                value={modalFormData.name}
                                onChange={(e) => setModalFormData({ ...modalFormData, name: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: 500 }}>Start Date</Form.Label>
                            <Form.Select>
                                <option>Hire Date</option>
                                <option>Custom Date</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: 500 }}>Frequency</Form.Label>
                            <div className="d-flex" style={{ gap: '0.5rem' }}>
                                <Form.Control
                                    type="number"
                                    placeholder="30"
                                    value={modalFormData.frequency}
                                    onChange={(e) => setModalFormData({ ...modalFormData, frequency: parseInt(e.target.value) || 0 })}
                                    style={{ width: '100px' }}
                                />
                                <Form.Select
                                    value={modalFormData.frequencyUnit}
                                    onChange={(e) => setModalFormData({ ...modalFormData, frequencyUnit: e.target.value })}
                                    style={{ flex: 1 }}
                                >
                                    <option value="days">Days</option>
                                    <option value="weeks">Weeks</option>
                                    <option value="months">Months</option>
                                    <option value="years">Years</option>
                                </Form.Select>
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: 500 }}>Notification Methods</Form.Label>
                            <div>
                                <Form.Check
                                    type="checkbox"
                                    id="method-email"
                                    label="Email"
                                    checked={modalFormData.notificationMethods?.includes('email')}
                                    onChange={(e) => {
                                        const methods = modalFormData.notificationMethods || [];
                                        setModalFormData({
                                            ...modalFormData,
                                            notificationMethods: e.target.checked
                                                ? [...methods, 'email']
                                                : methods.filter(m => m !== 'email')
                                        });
                                    }}
                                />
                                <Form.Check
                                    type="checkbox"
                                    id="method-sms"
                                    label="SMS"
                                    checked={modalFormData.notificationMethods?.includes('sms')}
                                    onChange={(e) => {
                                        const methods = modalFormData.notificationMethods || [];
                                        setModalFormData({
                                            ...modalFormData,
                                            notificationMethods: e.target.checked
                                                ? [...methods, 'sms']
                                                : methods.filter(m => m !== 'sms')
                                        });
                                    }}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: 500 }}>Recipients</Form.Label>
                            <InputGroup size="sm" className="mb-2">
                                <FormControl
                                    placeholder="Enter email or phone number"
                                    value={recipientInput}
                                    onChange={(e) => setRecipientInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddRecipient(recipientInput);
                                            setRecipientInput("");
                                        }
                                    }}
                                />
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => {
                                        handleAddRecipient(recipientInput);
                                        setRecipientInput("");
                                    }}
                                >
                                    <PlusCircle size={16} />
                                </Button>
                            </InputGroup>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {modalFormData.recipients?.map((recipient, idx) => (
                                    <Badge
                                        key={idx}
                                        bg="secondary"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.4rem 0.6rem',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        {recipient}
                                        <span
                                            onClick={() => handleRemoveRecipient(recipient)}
                                            style={{ cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            ×
                                        </span>
                                    </Badge>
                                ))}
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: 500, display: 'flex', justifyContent: 'space-between' }}>
                                <span>Message Template</span>
                                <Button variant="link" size="sm" style={{ fontSize: '0.8rem', padding: 0 }}>
                                    Insert Fields
                                </Button>
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter notification message..."
                                value={modalFormData.messageTemplate}
                                onChange={(e) => setModalFormData({ ...modalFormData, messageTemplate: e.target.value })}
                            />
                        </Form.Group>

                        <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '1rem' }}>
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    id="follow-up-enabled"
                                    label="Follow up after 1 week if not completed"
                                    checked={modalFormData.followUpEnabled}
                                    onChange={(e) => setModalFormData({ ...modalFormData, followUpEnabled: e.target.checked })}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    id="notify-incomplete"
                                    label="Notify me if recipient does not complete by due date"
                                    checked={modalFormData.notifyIfIncomplete}
                                    onChange={(e) => setModalFormData({ ...modalFormData, notifyIfIncomplete: e.target.checked })}
                                />
                            </Form.Group>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        style={{ backgroundColor: 'rgb(0, 96, 120)', border: 'none' }}
                        onClick={handleSaveRule}
                    >
                        Save Rule
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
