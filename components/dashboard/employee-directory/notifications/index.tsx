import { useState } from "react";
import { Button, Form, Modal, Badge, InputGroup, FormControl } from "react-bootstrap";
import { PlusCircle, Trash, PersonCircle, Envelope, PencilSquare } from "react-bootstrap-icons";
import { useTranslation } from "../../../../hooks/use-translation";
import { EmployeeEntity } from "../../../../models/employee/employee.entity";

interface NotificationsProps {
    employee: EmployeeEntity;
    canEdit?: boolean;
}

type ExpirationField = 'license_expiry' | 'mvr_expiry' | 'medical_card_expiry';

const EXPIRATION_FIELD_LABELS: Record<ExpirationField, string> = {
    license_expiry: "Driver's License Expiration Date",
    mvr_expiry: "MVR Expiration Date",
    medical_card_expiry: "Medical Card Expiration Date",
};

// Maps document type to its default expiration field and message templates
const DOCUMENT_TYPE_DEFAULTS: Record<string, {
    expirationField: ExpirationField;
    name: string;
    messageTemplate: string;
    followUpMessageTemplate: string;
}> = {
    "Commercial Driver's License": {
        expirationField: 'license_expiry',
        name: "License Expiration Warning",
        messageTemplate: "Your driver's license expires on {license_expiry} ({days_remaining} days remaining). Please renew it as soon as possible.",
        followUpMessageTemplate: "Reminder: Your driver's license expires on {license_expiry} ({days_remaining} days remaining) and we have not received your updated information.",
    },
    "Medical Certificate": {
        expirationField: 'medical_card_expiry',
        name: "Medical Certificate Expiration Warning",
        messageTemplate: "Your medical card expires on {medical_card_expiry} — in {days_remaining} days. Please renew it as soon as possible.",
        followUpMessageTemplate: "Reminder: Your medical card expires on {medical_card_expiry} ({days_remaining} days remaining). Please submit your updated certificate.",
    },
    "Motor Vehicle Record": {
        expirationField: 'mvr_expiry',
        name: "MVR Expiration Warning",
        messageTemplate: "MVR for {employee_name} expires on {mvr_expiry} ({days_remaining} days remaining). Please initiate the MVR review process.",
        followUpMessageTemplate: "",
    },
};

interface NotificationRule {
    id: number;
    name: string;
    documentType: string;
    frequency: number;
    frequencyUnit: string;
    startDateType: 'hire_date' | 'custom' | 'expiration_based';
    expirationField?: ExpirationField;
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

// Derives the rule name from the document type
function getNameForDocumentType(docType: string): string {
    return DOCUMENT_TYPE_DEFAULTS[docType]?.name ?? `${docType} Warning`;
}

// Returns a single combined trigger value for the select
function getTriggerValue(formData: Partial<NotificationRule>): string {
    if (formData.startDateType === 'expiration_based') {
        return formData.expirationField || 'license_expiry';
    }
    return formData.startDateType || 'hire_date';
}

export default function Notifications({ employee, canEdit = true }: NotificationsProps) {
    const { t } = useTranslation();

    const isGlobalMode = !employee;

    // Notification Rules State
    const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([
        {
            id: 1,
            name: "License Expiration Warning",
            documentType: "Commercial Driver's License",
            frequency: 60,
            frequencyUnit: "days",
            startDateType: 'expiration_based',
            expirationField: 'license_expiry',
            daysBeforeExpiration: 60,
            notifyDriver: true,
            driverNotificationMethods: ['email', 'sms'],
            notifyCompany: true,
            recipients: ["hr@company.com", "manager@company.com"],
            messageTemplate: "Your driver's license expires on {license_expiry} ({days_remaining} days remaining). Please renew it as soon as possible.",
            followUpEnabled: true,
            followUpDays: 7,
            followUpMessageTemplate: "Reminder: Your driver's license expires on {license_expiry} ({days_remaining} days remaining) and we have not received your updated information.",
            notifyIfIncomplete: true,
            enabled: true,
        },
        {
            id: 2,
            name: "Medical Certificate Expiration Warning",
            documentType: "Medical Certificate",
            frequency: 60,
            frequencyUnit: "days",
            startDateType: 'expiration_based',
            expirationField: 'medical_card_expiry',
            daysBeforeExpiration: 60,
            notifyDriver: true,
            driverNotificationMethods: ['email', 'sms'],
            notifyCompany: true,
            recipients: ["hr@company.com"],
            messageTemplate: "Your medical card expires on {medical_card_expiry} — in {days_remaining} days. Please renew it as soon as possible.",
            followUpEnabled: true,
            followUpDays: 7,
            followUpMessageTemplate: "Reminder: Your medical card expires on {medical_card_expiry} ({days_remaining} days remaining). Please submit your updated certificate.",
            notifyIfIncomplete: true,
            enabled: true,
        },
        {
            id: 3,
            name: "MVR Expiration Warning",
            documentType: "Motor Vehicle Record",
            frequency: 60,
            frequencyUnit: "days",
            startDateType: 'expiration_based',
            expirationField: 'mvr_expiry',
            daysBeforeExpiration: 60,
            notifyDriver: false,
            driverNotificationMethods: [],
            notifyCompany: true,
            recipients: ["hr@company.com"],
            messageTemplate: "MVR for {employee_name} expires on {mvr_expiry} ({days_remaining} days remaining). Please initiate the MVR review process.",
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
    const [recipientInput, setRecipientInput] = useState("");

    const emptyRule = (): Partial<NotificationRule> => ({
        name: getNameForDocumentType("Other"),
        documentType: "Other",
        frequency: 30,
        frequencyUnit: "days",
        startDateType: "hire_date",
        expirationField: undefined,
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

    const [modalFormData, setModalFormData] = useState<Partial<NotificationRule>>(emptyRule());

    const handleAddRule = () => {
        setIsNewRule(true);
        setEditingRule(null);
        setModalFormData(emptyRule());
        setRecipientInput("");
        setShowModal(true);
    };

    const handleEditRule = (rule: NotificationRule) => {
        setIsNewRule(false);
        setEditingRule(rule);
        setModalFormData(rule);
        setRecipientInput("");
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

    // When document type changes, auto-set trigger + message defaults (new rules only)
    const handleDocumentTypeChange = (docType: string) => {
        const defaults = DOCUMENT_TYPE_DEFAULTS[docType];
        if (defaults) {
            setModalFormData(prev => ({
                ...prev,
                documentType: docType,
                name: defaults.name,
                startDateType: 'expiration_based',
                expirationField: defaults.expirationField,
                messageTemplate: !prev.messageTemplate || isNewRule ? defaults.messageTemplate : prev.messageTemplate,
                followUpMessageTemplate: !prev.followUpMessageTemplate || isNewRule ? defaults.followUpMessageTemplate : prev.followUpMessageTemplate,
            }));
        } else {
            setModalFormData(prev => ({
                ...prev,
                documentType: docType,
                name: getNameForDocumentType(docType),
            }));
        }
    };

    // Handles the combined trigger select (startDateType + expirationField merged)
    const handleTriggerChange = (value: string) => {
        if (value === 'hire_date' || value === 'custom') {
            setModalFormData(prev => ({ ...prev, startDateType: value as 'hire_date' | 'custom', expirationField: undefined }));
        } else {
            setModalFormData(prev => ({ ...prev, startDateType: 'expiration_based', expirationField: value as ExpirationField }));
        }
    };

    const accentStyle = { width: '8px', height: '24px', backgroundColor: 'rgb(0, 96, 120)', marginRight: '0.75rem', borderRadius: '2px' } as const;

    return (
        <div className="employee_directory_tabs">
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, rgb(0, 96, 120) 0%, rgb(29, 67, 84) 100%)',
                borderRadius: '0.5rem',
                padding: '1.25rem 1.5rem',
                marginBottom: '1.5rem',
            }}>
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

            {/* Notification Rules */}
            <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', padding: '1.5rem', border: '1px solid #dee2e6' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 style={{ fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center' }}>
                        <span style={accentStyle}></span>
                        Notification Rules
                    </h6>
                    {canEdit && (
                        <Button
                            size="sm"
                            onClick={handleAddRule}
                            style={{ backgroundColor: 'rgb(0, 96, 120)', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <PlusCircle size={16} />
                            Add Rule
                        </Button>
                    )}
                </div>

                {notificationRules.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6c757d' }}>
                        <p>No notification rules configured yet.</p>
                        {canEdit && (
                            <Button variant="outline-primary" size="sm" onClick={handleAddRule}>
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
                                            <h6 style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>{rule.name}</h6>
                                            <Badge
                                                bg={rule.documentType === "Commercial Driver's License" ? "primary" :
                                                    rule.documentType === "Medical Certificate" ? "success" : "info"}
                                                className="ml-2"
                                                style={{ fontSize: '0.7rem' }}
                                            >
                                                {rule.documentType}
                                            </Badge>
                                            {canEdit && <PencilSquare size={13} className="ml-2" style={{ color: '#adb5bd' }} />}
                                        </div>

                                        <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                                            <div className="mb-1">
                                                {rule.startDateType === 'expiration_based' ? (
                                                    <span>
                                                        <strong>{rule.daysBeforeExpiration} days before </strong>
                                                        {rule.expirationField ? EXPIRATION_FIELD_LABELS[rule.expirationField] : 'expiration'}
                                                    </span>
                                                ) : rule.startDateType === 'custom' ? (
                                                    <span>
                                                        <strong>Fixed date</strong>
                                                        {rule.customStartDate && <span>, repeating every {rule.frequency} {rule.frequencyUnit}</span>}
                                                    </span>
                                                ) : (
                                                    <span>
                                                        <strong>Every {rule.frequency} {rule.frequencyUnit}</strong>
                                                        <span style={{ fontWeight: 400 }}> from hire date</span>
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mb-1" style={{ fontSize: '0.825rem' }}>
                                                {rule.notifyDriver && (
                                                    <span className="mr-3">
                                                        <PersonCircle size={14} className="mr-1" style={{ color: '#1d4354' }} />
                                                        <strong>Driver</strong> via {rule.driverNotificationMethods.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(' & ')}
                                                    </span>
                                                )}
                                                {rule.notifyCompany && (
                                                    <span>
                                                        <Envelope size={14} className="mr-1" style={{ color: '#198754' }} />
                                                        <strong>Company</strong>{rule.recipients.length > 0 && ` — ${rule.recipients.join(', ')}`}
                                                    </span>
                                                )}
                                            </div>
                                            {rule.messageTemplate && (
                                                <div style={{ fontStyle: 'italic', fontSize: '0.8rem', color: '#868e96' }}>
                                                    &quot;{rule.messageTemplate}&quot;
                                                </div>
                                            )}
                                        </div>

                                        {(rule.followUpEnabled || rule.notifyIfIncomplete) && (
                                            <div style={{ fontSize: '0.8rem', color: '#856404' }}>
                                                {rule.followUpEnabled && <span className="mr-3">Follow-up after {rule.followUpDays} days</span>}
                                                {rule.notifyIfIncomplete && <span>Staff alerted if not completed by due date</span>}
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
                                        <Form.Check
                                            type="switch"
                                            id={`rule-toggle-${rule.id}`}
                                            checked={rule.enabled}
                                            onChange={(e) => { e.stopPropagation(); handleToggleRule(rule.id); }}
                                            onClick={(e) => e.stopPropagation()}
                                            disabled={!canEdit}
                                        />
                                        {canEdit && (
                                            <Button
                                                variant="link"
                                                size="sm"
                                                onClick={(e) => { e.stopPropagation(); handleDeleteRule(rule.id); }}
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
                    style={{ backgroundColor: 'rgb(0, 96, 120)', border: 'none', padding: '0.5rem 2rem' }}
                    disabled={!canEdit}
                >
                    Save Settings
                </Button>
            </div>

            {/* Add/Edit Notification Rule Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton closeVariant="white" style={{ backgroundColor: 'rgb(0, 96, 120)', borderBottom: 'none' }}>
                    <Modal.Title style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>
                        {isNewRule ? "Add Notification Rule" : "Edit Notification Rule"}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ padding: '1.25rem 1.5rem', backgroundColor: '#f8f9fa' }}>
                    <Form>

                        {/* Section: Setup */}
                        <div style={{ backgroundColor: '#fff', border: '1px solid #e9ecef', borderRadius: '0.5rem', padding: '1.25rem', marginBottom: '1rem' }}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <Form.Label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Document Type</Form.Label>
                                    <Form.Select
                                        value={modalFormData.documentType}
                                        onChange={(e) => handleDocumentTypeChange(e.target.value)}
                                    >
                                        <option value="Other">Other</option>
                                        <option value="Commercial Driver's License">Commercial Driver&apos;s License</option>
                                        <option value="Medical Certificate">Medical Certificate</option>
                                        <option value="Motor Vehicle Record">Motor Vehicle Record</option>
                                    </Form.Select>
                                </div>
                                <div className="col-md-6">
                                    <Form.Label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Send notification based on</Form.Label>
                                    <Form.Select
                                        value={getTriggerValue(modalFormData)}
                                        onChange={(e) => handleTriggerChange(e.target.value)}
                                    >
                                        <optgroup label="Expiration Date">
                                            <option value="license_expiry">Driver&apos;s License Expiration Date</option>
                                            <option value="mvr_expiry">MVR Expiration Date</option>
                                            <option value="medical_card_expiry">Medical Card Expiration Date</option>
                                        </optgroup>
                                        <optgroup label="Other">
                                            <option value="hire_date">Hire Date</option>
                                            <option value="custom">Fixed Date</option>
                                        </optgroup>
                                    </Form.Select>
                                </div>

                                {modalFormData.startDateType === 'expiration_based' && (
                                    <div className="col-md-6">
                                        <Form.Label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Days Before Expiration</Form.Label>
                                        <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
                                            <Form.Control
                                                type="number"
                                                min="1"
                                                value={modalFormData.daysBeforeExpiration}
                                                onChange={(e) => setModalFormData({ ...modalFormData, daysBeforeExpiration: parseInt(e.target.value) || 60 })}
                                                style={{ width: '90px' }}
                                            />
                                            <span className="text-muted" style={{ fontSize: '0.875rem' }}>days before expiration</span>
                                        </div>
                                    </div>
                                )}

                                {modalFormData.startDateType === 'custom' && (
                                    <div className="col-md-6">
                                        <Form.Label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Fixed Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={modalFormData.customStartDate}
                                            onChange={(e) => setModalFormData({ ...modalFormData, customStartDate: e.target.value })}
                                        />
                                    </div>
                                )}

                                {modalFormData.startDateType !== 'expiration_based' && (
                                    <div className="col-md-6">
                                        <Form.Label style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                            {modalFormData.startDateType === 'hire_date' ? 'Remind every' : 'Repeat every'}
                                        </Form.Label>
                                        <div className="d-flex" style={{ gap: '0.5rem' }}>
                                            <Form.Control
                                                type="number"
                                                min="1"
                                                value={modalFormData.frequency}
                                                onChange={(e) => setModalFormData({ ...modalFormData, frequency: parseInt(e.target.value) || 0 })}
                                                style={{ width: '90px' }}
                                            />
                                            <Form.Select
                                                value={modalFormData.frequencyUnit}
                                                onChange={(e) => setModalFormData({ ...modalFormData, frequencyUnit: e.target.value })}
                                            >
                                                <option value="days">Days</option>
                                                <option value="weeks">Weeks</option>
                                                <option value="months">Months</option>
                                                <option value="years">Years</option>
                                            </Form.Select>
                                        </div>
                                        {modalFormData.startDateType === 'hire_date' && (
                                            <Form.Text className="text-muted">Starting from the employee&apos;s hire date</Form.Text>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Section: Recipients */}
                        <div style={{ backgroundColor: '#fff', border: '1px solid #e9ecef', borderRadius: '0.5rem', padding: '1.25rem', marginBottom: '1rem' }}>
                            <p style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6c757d', marginBottom: '1rem' }}>Recipients</p>

                            <Form.Check
                                type="checkbox"
                                id="notify-driver"
                                label={<strong>Notify Driver</strong>}
                                checked={modalFormData.notifyDriver}
                                onChange={(e) => setModalFormData({ ...modalFormData, notifyDriver: e.target.checked })}
                                className="mb-2"
                            />
                            {modalFormData.notifyDriver && (
                                <div className="mb-3" style={{ marginLeft: '1.75rem', padding: '0.75rem 1rem', backgroundColor: '#f0f8ff', borderLeft: '3px solid rgb(0, 96, 120)', borderRadius: '0.25rem' }}>
                                    <Form.Label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Send via</Form.Label>
                                    <div className="d-flex" style={{ gap: '1.5rem' }}>
                                        <Form.Check
                                            type="checkbox"
                                            id="driver-method-email"
                                            label="Email"
                                            checked={modalFormData.driverNotificationMethods?.includes('email')}
                                            onChange={(e) => {
                                                const methods = modalFormData.driverNotificationMethods || [];
                                                setModalFormData({ ...modalFormData, driverNotificationMethods: e.target.checked ? [...methods, 'email'] : methods.filter((m: string) => m !== 'email') });
                                            }}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            id="driver-method-sms"
                                            label="SMS"
                                            checked={modalFormData.driverNotificationMethods?.includes('sms')}
                                            onChange={(e) => {
                                                const methods = modalFormData.driverNotificationMethods || [];
                                                setModalFormData({ ...modalFormData, driverNotificationMethods: e.target.checked ? [...methods, 'sms'] : methods.filter((m: string) => m !== 'sms') });
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            <Form.Check
                                type="checkbox"
                                id="notify-company"
                                label={<strong>Notify Company Staff (Email)</strong>}
                                checked={modalFormData.notifyCompany}
                                onChange={(e) => setModalFormData({ ...modalFormData, notifyCompany: e.target.checked })}
                                className="mb-2"
                            />
                            {modalFormData.notifyCompany && (
                                <div style={{ marginLeft: '1.75rem', padding: '0.75rem 1rem', backgroundColor: '#f8f9fa', borderLeft: '3px solid rgb(0, 96, 120)', borderRadius: '0.25rem' }}>
                                    <Form.Label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Email Recipients</Form.Label>
                                    <InputGroup className="mb-2">
                                        <FormControl
                                            placeholder="hr@company.com"
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
                                            style={{ backgroundColor: 'rgb(0, 96, 120)', border: 'none' }}
                                            onClick={() => { handleAddRecipient(recipientInput); setRecipientInput(""); }}
                                        >
                                            <PlusCircle size={16} className="mr-1" /> Add
                                        </Button>
                                    </InputGroup>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                        {modalFormData.recipients?.map((recipient, idx) => (
                                            <Badge key={idx} bg="secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.6rem', fontSize: '0.82rem', fontWeight: 400 }}>
                                                {recipient}
                                                <span onClick={() => handleRemoveRecipient(recipient)} style={{ cursor: 'pointer', fontWeight: 700 }}>×</span>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Section: Message */}
                        <div style={{ backgroundColor: '#fff', border: '1px solid #e9ecef', borderRadius: '0.5rem', padding: '1.25rem' }}>
                            <p style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6c757d', marginBottom: '1rem' }}>Message</p>

                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Message sent when this rule triggers..."
                                value={modalFormData.messageTemplate}
                                onChange={(e) => setModalFormData({ ...modalFormData, messageTemplate: e.target.value })}
                                style={{ fontSize: '0.875rem', marginBottom: '0.35rem' }}
                            />
                            <Form.Text className="text-muted d-block mb-3" style={{ fontSize: '0.78rem' }}>
                                Variables: <code>{'{employee_name}'}</code> <code>{'{days_remaining}'}</code> <code>{'{due_date}'}</code> <code>{'{license_expiry}'}</code> <code>{'{mvr_expiry}'}</code> <code>{'{medical_card_expiry}'}</code> <code>{'{hire_date}'}</code>
                            </Form.Text>

                            <Form.Check
                                type="checkbox"
                                id="follow-up-enabled"
                                label={<strong>Send follow-up if not completed</strong>}
                                checked={modalFormData.followUpEnabled}
                                onChange={(e) => setModalFormData({ ...modalFormData, followUpEnabled: e.target.checked })}
                                className="mb-2"
                            />
                            {modalFormData.followUpEnabled && (
                                <div className="mb-3" style={{ marginLeft: '1.75rem', padding: '0.75rem 1rem', backgroundColor: '#fffbf0', borderLeft: '3px solid #e6a817', borderRadius: '0.25rem' }}>
                                    <div className="d-flex align-items-center mb-3" style={{ gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Follow-up after</span>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            value={modalFormData.followUpDays}
                                            onChange={(e) => setModalFormData({ ...modalFormData, followUpDays: parseInt(e.target.value) || 7 })}
                                            style={{ width: '75px' }}
                                        />
                                        <span style={{ fontSize: '0.875rem', color: '#495057' }}>days</span>
                                    </div>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Reminder message if the driver hasn't completed the required action..."
                                        value={modalFormData.followUpMessageTemplate}
                                        onChange={(e) => setModalFormData({ ...modalFormData, followUpMessageTemplate: e.target.value })}
                                        style={{ fontSize: '0.875rem', marginBottom: '0.35rem' }}
                                    />
                                    <Form.Text className="text-muted" style={{ fontSize: '0.78rem' }}>
                                        Variables: <code>{'{employee_name}'}</code> <code>{'{days_remaining}'}</code> <code>{'{due_date}'}</code> <code>{'{license_expiry}'}</code> <code>{'{mvr_expiry}'}</code> <code>{'{medical_card_expiry}'}</code> <code>{'{hire_date}'}</code>
                                    </Form.Text>
                                </div>
                            )}

                            <Form.Check
                                type="checkbox"
                                id="notify-incomplete"
                                label={<span>Alert company staff if driver has not completed by due date</span>}
                                checked={modalFormData.notifyIfIncomplete}
                                onChange={(e) => setModalFormData({ ...modalFormData, notifyIfIncomplete: e.target.checked })}
                            />
                        </div>

                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button style={{ backgroundColor: 'rgb(0, 96, 120)', border: 'none' }} onClick={handleSaveRule}>Save Rule</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
