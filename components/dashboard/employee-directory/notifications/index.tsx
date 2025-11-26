import { useState } from "react";
import { Button, Form, Modal, Badge, InputGroup, FormControl } from "react-bootstrap";
import { PlusCircle, Trash, PersonCircle, Envelope, PencilSquare } from "react-bootstrap-icons";
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
    startDateType: 'hire_date' | 'custom' | 'expiration_based';
    customStartDate?: string;
    daysBeforeExpiration?: number;
    notifyDriver: boolean;
    driverNotificationMethods: ('email' | 'sms')[];
    notifyCompany: boolean;
    recipients: string[];
    messageTemplate: string;
    followUpEnabled: boolean;
    followUpDays: number;
    followUpMessageTemplate: string;
    notifyIfIncomplete: boolean;
    enabled: boolean;
}

export default function Notifications({ employee, canEdit = true }: NotificationsProps) {
    const { t } = useTranslation();

    // Determine if this is global settings mode (employee is null)
    const isGlobalMode = !employee;

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
            frequency: 60,
            frequencyUnit: "days",
            startDateType: 'expiration_based',
            daysBeforeExpiration: 60,
            notifyDriver: true,
            driverNotificationMethods: ['email', 'sms'],
            notifyCompany: true,
            recipients: ["hr@company.com", "manager@company.com"],
            messageTemplate: "Your driver's license expires in {days_remaining} days. Please renew it as soon as possible.",
            followUpEnabled: true,
            followUpDays: 7,
            followUpMessageTemplate: "Reminder: Your driver's license expires in {days_remaining} days and we have not received your updated information.",
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
            startDateType: 'hire_date',
            notifyDriver: true,
            driverNotificationMethods: ['email', 'sms'],
            notifyCompany: true,
            recipients: ["hr@company.com"],
            messageTemplate: "Your medical certificate renewal is due. Please upload your updated certificate.",
            followUpEnabled: true,
            followUpDays: 7,
            followUpMessageTemplate: "Follow-up: We have not received your updated medical certificate. Please submit it immediately.",
            notifyIfIncomplete: true,
            enabled: true,
        },
        {
            id: 3,
            name: "MVR Annual Review",
            document: "Motor Vehicle Record",
            documentType: "Motor Vehicle Record",
            frequency: 1,
            frequencyUnit: "years",
            startDateType: 'hire_date',
            notifyDriver: false,
            driverNotificationMethods: [],
            notifyCompany: true,
            recipients: ["hr@company.com"],
            messageTemplate: "Annual MVR review due for {employee_name}.",
            followUpEnabled: false,
            followUpDays: 0,
            followUpMessageTemplate: "",
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
        startDateType: "hire_date",
        customStartDate: "",
        daysBeforeExpiration: 60,
        notifyDriver: true,
        driverNotificationMethods: ['email'],
        notifyCompany: true,
        recipients: [],
        messageTemplate: "",
        followUpEnabled: false,
        followUpDays: 7,
        followUpMessageTemplate: "",
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
            startDateType: "hire_date",
            customStartDate: "",
            daysBeforeExpiration: 60,
            notifyDriver: true,
            driverNotificationMethods: ['email'],
            notifyCompany: true,
            recipients: [],
            messageTemplate: "",
            followUpEnabled: false,
            followUpDays: 7,
            followUpMessageTemplate: "",
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
                        {isGlobalMode
                            ? 'Global Employee Notification Settings'
                            : `Notification Settings for ${employee.first_name} ${employee.last_name}`}
                    </h5>
                    {isGlobalMode && (
                        <p style={{ color: '#fff', margin: '0.5rem 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
                            Configure default notification rules that apply to all employees
                        </p>
                    )}
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
                                    cursor: canEdit ? 'pointer' : 'default',
                                    transition: 'all 0.2s',
                                    position: 'relative' as const,
                                }}
                                onClick={() => canEdit && handleEditRule(rule)}
                                onMouseEnter={(e) => {
                                    if (canEdit) {
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,96,120,0.15)';
                                        e.currentTarget.style.borderColor = 'rgb(0, 96, 120)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (canEdit) {
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.borderColor = '#dee2e6';
                                    }
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
                                            {canEdit && (
                                                <span
                                                    style={{
                                                        marginLeft: '0.5rem',
                                                        color: '#6c757d',
                                                        fontSize: '0.75rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem'
                                                    }}
                                                >
                                                    <PencilSquare size={12} />
                                                    <span style={{ fontSize: '0.7rem' }}>Click to edit</span>
                                                </span>
                                            )}
                                        </div>

                                        <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.75rem' }}>
                                            <div className="mb-1">
                                                {rule.startDateType === 'expiration_based' ? (
                                                    <strong>{rule.daysBeforeExpiration} days before expiration</strong>
                                                ) : (
                                                    <>
                                                        <strong>Every {rule.frequency} {rule.frequencyUnit}</strong>
                                                        {rule.startDateType === 'custom' && rule.customStartDate && (
                                                            <span> (starts {new Date(rule.customStartDate).toLocaleDateString()})</span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                            <div className="mb-1" style={{ fontSize: '0.825rem' }}>
                                                {rule.notifyDriver && (
                                                    <span className="mr-3">
                                                        <PersonCircle size={14} className="mr-1" style={{ color: '#0d6efd' }} />
                                                        <strong>Driver:</strong> {rule.driverNotificationMethods.map(m => m.toUpperCase()).join(', ')}
                                                    </span>
                                                )}
                                                {rule.notifyCompany && (
                                                    <span>
                                                        <Envelope size={14} className="mr-1" style={{ color: '#198754' }} />
                                                        <strong>Company:</strong> Email
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ fontStyle: 'italic', fontSize: '0.825rem' }}>
                                                &quot;{rule.messageTemplate}&quot;
                                            </div>
                                        </div>

                                        <div style={{ fontSize: '0.8rem', color: '#495057' }}>
                                            <div>
                                                <strong>Company Recipients:</strong> {rule.recipients.join(", ")}
                                            </div>
                                            {rule.followUpEnabled && (
                                                <div className="mt-1" style={{ color: '#856404' }}>
                                                    <strong>Follow-up:</strong> After {rule.followUpDays} days if not completed
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
                                        <Form.Check
                                            type="switch"
                                            id={`rule-toggle-${rule.id}`}
                                            checked={rule.enabled}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                handleToggleRule(rule.id);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            disabled={!canEdit}
                                        />
                                        {canEdit && (
                                            <Button
                                                variant="link"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteRule(rule.id);
                                                }}
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
                <Modal.Header
                    closeButton
                    closeVariant="white"
                    style={{
                        backgroundColor: 'rgb(0, 96, 120)',
                        borderBottom: '2px solid rgb(0, 96, 120)'
                    }}
                >
                    <Modal.Title style={{ fontSize: '1.125rem', fontWeight: 600, color: '#fff' }}>
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
                                <option value="Commercial Driver's License">Commercial Driver&apos;s License</option>
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
                            <Form.Label style={{ fontWeight: 500 }}>Start Date / Trigger</Form.Label>
                            <Form.Select
                                value={modalFormData.startDateType}
                                onChange={(e) => {
                                    const newType = e.target.value as 'hire_date' | 'custom' | 'expiration_based';
                                    setModalFormData({
                                        ...modalFormData,
                                        startDateType: newType,
                                        // Set default for driver license expiration
                                        daysBeforeExpiration: newType === 'expiration_based' &&
                                            modalFormData.documentType === "Commercial Driver's License" ? 60 : modalFormData.daysBeforeExpiration
                                    });
                                }}
                            >
                                <option value="hire_date">Hire Date</option>
                                <option value="custom">Custom Date</option>
                                {modalFormData.documentType === "Commercial Driver's License" && (
                                    <option value="expiration_based">Expiration Based (Driver License)</option>
                                )}
                            </Form.Select>
                        </Form.Group>

                        {modalFormData.startDateType === 'custom' && (
                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: 500 }}>Custom Start Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={modalFormData.customStartDate}
                                    onChange={(e) => setModalFormData({ ...modalFormData, customStartDate: e.target.value })}
                                />
                            </Form.Group>
                        )}

                        {modalFormData.startDateType === 'expiration_based' && (
                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: 500 }}>Days Before Expiration</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="60"
                                    value={modalFormData.daysBeforeExpiration}
                                    onChange={(e) => setModalFormData({ ...modalFormData, daysBeforeExpiration: parseInt(e.target.value) || 60 })}
                                />
                                <Form.Text className="text-muted">
                                    For driver&apos;s license, the system will remind 60 days before expiration by default
                                </Form.Text>
                            </Form.Group>
                        )}

                        {modalFormData.startDateType !== 'expiration_based' && (
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
                        )}

                        <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '1rem', marginTop: '1rem' }}>
                            <h6 style={{ fontWeight: 600, marginBottom: '1rem' }}>Notification Recipients</h6>

                            <Form.Group className="mb-4">
                                <div className="d-flex align-items-center mb-2">
                                    <Form.Check
                                        type="checkbox"
                                        id="notify-driver"
                                        label={<strong>Notify Driver</strong>}
                                        checked={modalFormData.notifyDriver}
                                        onChange={(e) => setModalFormData({ ...modalFormData, notifyDriver: e.target.checked })}
                                    />
                                </div>
                                {modalFormData.notifyDriver && (
                                    <div style={{
                                        marginLeft: '1.5rem',
                                        paddingLeft: '1rem',
                                        borderLeft: '3px solid rgb(0, 96, 120)',
                                        backgroundColor: '#f0f8ff',
                                        padding: '1rem',
                                        borderRadius: '0.25rem'
                                    }}>
                                        <Form.Label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#495057', marginBottom: '0.75rem' }}>
                                            <PersonCircle size={16} className="mr-2" style={{ color: '#0d6efd' }} />
                                            Notification Method
                                        </Form.Label>
                                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                                            <Form.Check
                                                type="checkbox"
                                                id="driver-method-email"
                                                label={
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <Envelope size={14} />
                                                        Email
                                                    </span>
                                                }
                                                checked={modalFormData.driverNotificationMethods?.includes('email')}
                                                onChange={(e) => {
                                                    const methods = modalFormData.driverNotificationMethods || [];
                                                    setModalFormData({
                                                        ...modalFormData,
                                                        driverNotificationMethods: e.target.checked
                                                            ? [...methods, 'email']
                                                            : methods.filter((m: string) => m !== 'email')
                                                    });
                                                }}
                                            />
                                            <Form.Check
                                                type="checkbox"
                                                id="driver-method-sms"
                                                label="SMS"
                                                checked={modalFormData.driverNotificationMethods?.includes('sms')}
                                                onChange={(e) => {
                                                    const methods = modalFormData.driverNotificationMethods || [];
                                                    setModalFormData({
                                                        ...modalFormData,
                                                        driverNotificationMethods: e.target.checked
                                                            ? [...methods, 'sms']
                                                            : methods.filter((m: string) => m !== 'sms')
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <div className="d-flex align-items-center mb-2">
                                    <Form.Check
                                        type="checkbox"
                                        id="notify-company"
                                        label={<strong>Notify Company Users (Email)</strong>}
                                        checked={modalFormData.notifyCompany}
                                        onChange={(e) => setModalFormData({ ...modalFormData, notifyCompany: e.target.checked })}
                                    />
                                </div>
                                {modalFormData.notifyCompany && (
                                    <div style={{
                                        marginLeft: '1.5rem',
                                        paddingLeft: '1rem',
                                        borderLeft: '3px solid rgb(0, 96, 120)',
                                        backgroundColor: '#f8f9fa',
                                        padding: '1rem',
                                        borderRadius: '0.25rem'
                                    }}>
                                        <Form.Label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#495057' }}>
                                            <Envelope size={16} className="mr-2" style={{ color: '#198754' }} />
                                            Email Recipients
                                        </Form.Label>
                                        <InputGroup className="mb-2">
                                            <FormControl
                                                placeholder="Enter email address (e.g., hr@company.com)"
                                                value={recipientInput}
                                                onChange={(e) => setRecipientInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddRecipient(recipientInput);
                                                        setRecipientInput("");
                                                    }
                                                }}
                                            />
                                            <Button
                                                style={{
                                                    backgroundColor: 'rgb(0, 96, 120)',
                                                    border: 'none'
                                                }}
                                                onClick={() => {
                                                    handleAddRecipient(recipientInput);
                                                    setRecipientInput("");
                                                }}
                                            >
                                                <PlusCircle size={16} className="mr-1" />
                                                Add
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
                                    </div>
                                )}
                            </Form.Group>
                        </div>

                        <div style={{
                            borderTop: '2px solid #dee2e6',
                            paddingTop: '1.5rem',
                            marginTop: '1.5rem',
                            backgroundColor: '#fafbfc',
                            padding: '1.5rem',
                            borderRadius: '0.375rem',
                            marginLeft: '-1rem',
                            marginRight: '-1rem'
                        }}>
                            <h6 style={{ fontWeight: 600, marginBottom: '1rem', color: 'rgb(0, 96, 120)' }}>
                                📧 Message Templates
                            </h6>

                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: 500, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                                    Initial Notification Message
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Enter the message that will be sent to drivers when a form is due..."
                                    value={modalFormData.messageTemplate}
                                    onChange={(e) => setModalFormData({ ...modalFormData, messageTemplate: e.target.value })}
                                    style={{ fontSize: '0.9rem' }}
                                />
                                <Form.Text className="text-muted" style={{ fontSize: '0.85rem' }}>
                                    💡 Available fields: <code>{'{employee_name}'}</code>, <code>{'{days_remaining}'}</code>, <code>{'{due_date}'}</code>
                                </Form.Text>
                            </Form.Group>
                        </div>

                        <div style={{
                            borderTop: '2px solid #dee2e6',
                            paddingTop: '1.5rem',
                            marginTop: '1.5rem',
                            backgroundColor: '#fff8e6',
                            padding: '1.5rem',
                            borderRadius: '0.375rem',
                            marginLeft: '-1rem',
                            marginRight: '-1rem'
                        }}>
                            <h6 style={{ fontWeight: 600, marginBottom: '1rem', color: '#856404' }}>
                                🔄 Follow-up Protocol
                            </h6>

                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    id="follow-up-enabled"
                                    label={<strong style={{ fontSize: '1rem' }}>Enable follow-up notifications if driver doesn't respond</strong>}
                                    checked={modalFormData.followUpEnabled}
                                    onChange={(e) => setModalFormData({ ...modalFormData, followUpEnabled: e.target.checked })}
                                />
                            </Form.Group>

                            {modalFormData.followUpEnabled && (
                                <div style={{
                                    marginLeft: '1.5rem',
                                    paddingLeft: '1.5rem',
                                    borderLeft: '3px solid #ffc107',
                                    backgroundColor: '#fffbf0',
                                    padding: '1.25rem',
                                    borderRadius: '0.25rem'
                                }}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                                            ⏱️ Follow-up After (Days)
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="7"
                                            value={modalFormData.followUpDays}
                                            onChange={(e) => setModalFormData({ ...modalFormData, followUpDays: parseInt(e.target.value) || 7 })}
                                            style={{ width: '180px' }}
                                        />
                                        <Form.Text className="text-muted" style={{ fontSize: '0.85rem' }}>
                                            Send follow-up notification if driver hasn't completed the form
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group className="mb-0">
                                        <Form.Label style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                                            📝 Follow-up Message Template
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Enter the reminder message to send if driver hasn't responded..."
                                            value={modalFormData.followUpMessageTemplate}
                                            onChange={(e) => setModalFormData({ ...modalFormData, followUpMessageTemplate: e.target.value })}
                                            style={{ fontSize: '0.9rem' }}
                                        />
                                        <Form.Text className="text-muted" style={{ fontSize: '0.85rem' }}>
                                            This message will be sent to the driver if they haven&apos;t completed the form
                                        </Form.Text>
                                    </Form.Group>
                                </div>
                            )}

                            <div style={{
                                marginTop: '1rem',
                                paddingTop: '1rem',
                                borderTop: '1px dashed #ffc107'
                            }}>
                                <Form.Group className="mb-0">
                                    <Form.Check
                                        type="checkbox"
                                        id="notify-incomplete"
                                        label={
                                            <span>
                                                <strong>Notify company users</strong> if driver does not complete by due date
                                            </span>
                                        }
                                        checked={modalFormData.notifyIfIncomplete}
                                        onChange={(e) => setModalFormData({ ...modalFormData, notifyIfIncomplete: e.target.checked })}
                                    />
                                    <Form.Text className="text-muted" style={{ fontSize: '0.85rem', marginLeft: '1.5rem', display: 'block', marginTop: '0.25rem' }}>
                                        Company recipients will receive an alert if the driver fails to complete the required form
                                    </Form.Text>
                                </Form.Group>
                            </div>
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
