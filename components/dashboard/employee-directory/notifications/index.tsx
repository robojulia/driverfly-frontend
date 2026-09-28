import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Alert, Button, Form, Modal, Badge, InputGroup, FormControl, Spinner } from "react-bootstrap";
import { PlusCircle, Trash, PersonCircle, Envelope, PencilSquare, Files, Send, People } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { useAuth } from "../../../../hooks/use-auth";
import { EmployeeEntity } from "../../../../models/employee/employee.entity";
import EmployeeNotificationsApi, {
    ExpirationField,
    NotificationLogEntry,
    NotificationRule,
    RuleAudience,
} from "../../../../pages/api/employee-notifications";
import JobApi from "../../../../pages/api/job";

interface NotificationsProps {
    /** null for the company-wide settings; an employee for that driver's own settings. */
    employee: EmployeeEntity | null;
    canEdit?: boolean;
    /**
     * Company-wide mode only: the group the user chose to configure, as an audience key
     * ('all', 'owner_operators', 'company_drivers' or 'position:<jobId>'). Shows that group's
     * rules and makes new rules apply to it.
     */
    audienceFilter?: string;
}

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

const STAGE_LABELS: Record<NotificationLogEntry['stage'], string> = {
    initial: 'Reminder',
    follow_up: 'Follow-up',
    incomplete: 'Overdue alert',
};

const CHANNEL_LABELS: Record<string, string> = {
    driver_email: 'driver email',
    driver_sms: 'driver SMS',
    company_email: 'staff email',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// This screen used to prefill these; company.com is a real domain, so they must be replaced before sending.
const PLACEHOLDER_RECIPIENTS = ['hr@company.com', 'manager@company.com'];

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

/** 'all' | 'owner_operators' | 'company_drivers' | 'position:<id>' → audience. */
export function audienceFromKey(key?: string): RuleAudience | null {
    if (!key) return null;
    if (key === 'all' || key === 'owner_operators' || key === 'company_drivers') return { type: key };
    const m = /^position:(\d+)$/.exec(key);
    return m ? { type: 'positions', jobIds: [Number(m[1])] } : null;
}

function sameAudience(a: RuleAudience, b: RuleAudience): boolean {
    if (a.type !== b.type) return false;
    if (a.type === 'positions' && b.type === 'positions') {
        return a.jobIds.length === b.jobIds.length && a.jobIds.every((id) => b.jobIds.includes(id));
    }
    return true;
}

function audienceLabel(audience: RuleAudience | undefined, jobs: { id: number; title: string }[]): string {
    switch (audience?.type ?? 'all') {
        case 'owner_operators': return 'Owner operators';
        case 'company_drivers': return 'Company drivers';
        case 'positions': {
            const titles = (audience as { jobIds: number[] }).jobIds.map((id) => jobs.find((j) => j.id === id)?.title ?? `Position #${id}`);
            return titles.length === 1 ? titles[0] : `${titles.length} positions`;
        }
        default: return 'All employees';
    }
}

/** Mirrors the server's checks so problems show in the form instead of as a failed save. */
function ruleProblem(rule: Partial<NotificationRule>): string | null {
    if (!rule.messageTemplate?.trim()) return 'Enter the message to send.';
    if (rule.startDateType === 'custom' && !rule.customStartDate) return 'Choose the fixed date.';
    if (rule.startDateType === 'hire_date' && !(Number(rule.frequency) >= 1)) return 'Set how often to remind.';
    if (!rule.notifyDriver && !rule.notifyCompany) return 'Choose at least one recipient: the driver and/or company staff.';
    if (rule.notifyDriver && !rule.driverNotificationMethods?.length) return 'Choose email and/or SMS for the driver.';
    const bad = rule.recipients?.find((r) => !EMAIL_RE.test(r));
    if (bad) return `"${bad}" is not a valid email address.`;
    const placeholder = rule.recipients?.find((r) => PLACEHOLDER_RECIPIENTS.includes(r.toLowerCase()));
    if (placeholder) return `${placeholder} is an example address. Replace it with a real staff email.`;
    if ((rule.notifyCompany || rule.notifyIfIncomplete) && !rule.recipients?.length) {
        return rule.notifyCompany ? 'Add at least one company staff email.' : 'Overdue alerts go to company staff: add at least one staff email.';
    }
    if (rule.followUpEnabled && (!(Number(rule.followUpDays) >= 1) || !rule.followUpMessageTemplate?.trim())) {
        return 'A follow-up needs a number of days and a message.';
    }
    if (rule.audience?.type === 'positions' && !rule.audience.jobIds.length) return 'Choose at least one position.';
    return null;
}

/** Ids only need to be unique within one list; a timestamp also keeps a deleted rule's id from being reused. */
function newRuleId(rules: NotificationRule[]): number {
    return Math.max(Date.now(), ...rules.map((r) => r.id + 1));
}

export default function Notifications({ employee, canEdit = true, audienceFilter }: NotificationsProps) {
    const { user } = useAuth();
    const companyId = user?.company?.id;
    const api = useMemo(() => new EmployeeNotificationsApi(), []);

    const isGlobalMode = !employee;

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [saving, setSaving] = useState(false);
    const [running, setRunning] = useState(false);
    const [dirty, setDirty] = useState(false);

    const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([]);
    const [sendingEnabled, setSendingEnabled] = useState(false);
    const [savedSendingEnabled, setSavedSendingEnabled] = useState(false);
    // Employee mode: whether this driver has their own rules
    const [custom, setCustom] = useState(false);
    const [savedCustom, setSavedCustom] = useState(false);
    const [employeeInfo, setEmployeeInfo] = useState<{ is_owner_operator: boolean; jobTitle: string | null; hasEmail: boolean; hasMobile: boolean } | null>(null);
    const [jobs, setJobs] = useState<{ id: number; title: string }[]>([]);
    const [log, setLog] = useState<NotificationLogEntry[]>([]);

    const [filterKey, setFilterKey] = useState<string>(audienceFilter ?? '');
    useEffect(() => setFilterKey(audienceFilter ?? ''), [audienceFilter]);
    const activeAudience = isGlobalMode ? audienceFromKey(filterKey) : null;

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingRule, setEditingRule] = useState<NotificationRule | null>(null);
    const [isNewRule, setIsNewRule] = useState(false);
    const [recipientInput, setRecipientInput] = useState("");
    const [modalError, setModalError] = useState<string | null>(null);

    const emptyRule = (): Partial<NotificationRule> => ({
        name: getNameForDocumentType("Other"),
        documentType: "Other",
        frequency: 30,
        frequencyUnit: "days",
        startDateType: "hire_date",
        expirationField: undefined,
        customStartDate: "",
        daysBeforeExpiration: 60,
        completeWithinDays: 14,
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
        audience: activeAudience ?? { type: 'all' },
    });

    const [modalFormData, setModalFormData] = useState<Partial<NotificationRule>>(emptyRule());

    const canEditRules = canEdit && (isGlobalMode || custom);

    const loadLog = async () => {
        if (!companyId) return;
        try {
            setLog(isGlobalMode ? await api.getLog(companyId, 10) : await api.getEmployeeLog(companyId, employee.id, 10));
        } catch {
            // The history is informational; the settings still work without it.
        }
    };

    const load = async () => {
        if (!companyId) { setLoading(false); return; }
        setLoading(true);
        setLoadError(false);
        try {
            if (isGlobalMode) {
                const settings = await api.getSettings(companyId);
                setNotificationRules(settings.rules);
                setSendingEnabled(settings.sendingEnabled);
                setSavedSendingEnabled(settings.saved && settings.sendingEnabled);
            } else {
                const settings = await api.getEmployee(companyId, employee.id);
                setNotificationRules(settings.rules);
                setCustom(settings.custom);
                setSavedCustom(settings.custom);
                setSendingEnabled(settings.sendingEnabled);
                setSavedSendingEnabled(settings.sendingEnabled);
                setEmployeeInfo(settings.employee);
            }
            setDirty(false);
        } catch {
            setLoadError(true);
        } finally {
            setLoading(false);
        }
        loadLog();
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [companyId, employee?.id]);

    useEffect(() => {
        if (!isGlobalMode) return;
        new JobApi().list({ limit: 200 } as any)
            .then((result: any) => {
                const items = Array.isArray(result) ? result : result?.items ?? [];
                setJobs(items.filter((j: any) => j?.id).map((j: any) => ({ id: j.id, title: j.title || `Position #${j.id}` })));
            })
            .catch(() => setJobs([]));
    }, [isGlobalMode]);

    const updateRules = (rules: NotificationRule[]) => {
        setNotificationRules(rules);
        setDirty(true);
    };

    const errorMessage = (err: any, fallback: string) => {
        const data = err?.response?.data;
        const reason = data?.reason ?? data?.message?.reason;
        if (reason) return `${fallback}: rule ${data?.rule ?? data?.message?.rule}: ${reason}`;
        if (err?.response?.status === 403) return 'Only company administrators can change notification settings.';
        return fallback;
    };

    const handleSaveSettings = async () => {
        if (!companyId) return;
        const invalid = notificationRules.find((r) => ruleProblem(r));
        if (invalid) {
            toast.error(`"${invalid.name}": ${ruleProblem(invalid)}`);
            return;
        }
        setSaving(true);
        try {
            if (isGlobalMode) {
                const saved = await api.saveSettings(companyId, { sendingEnabled, rules: notificationRules });
                setNotificationRules(saved.rules);
                setSendingEnabled(saved.sendingEnabled);
                setSavedSendingEnabled(saved.sendingEnabled);
            } else {
                const saved = await api.saveEmployee(companyId, employee.id, notificationRules);
                setNotificationRules(saved.rules);
                setCustom(saved.custom);
                setSavedCustom(saved.custom);
            }
            setDirty(false);
            toast.success('Notification settings saved');
        } catch (err) {
            toast.error(errorMessage(err, 'Failed to save notification settings'));
        } finally {
            setSaving(false);
        }
    };

    const handleCustomize = () => {
        // Start from the company rules this driver gets today; nothing changes until saved.
        setCustom(true);
        setDirty(true);
    };

    const handleRevert = async () => {
        if (!companyId) return;
        if (!savedCustom) {
            // Customizing was never saved: just drop it.
            await load();
            return;
        }
        if (!window.confirm(`Remove ${employee.first_name}'s own rules and use the company-wide rules again?`)) return;
        setSaving(true);
        try {
            const settings = await api.clearEmployee(companyId, employee.id);
            setNotificationRules(settings.rules);
            setCustom(false);
            setSavedCustom(false);
            setDirty(false);
            toast.success('Now using company-wide rules');
        } catch (err) {
            toast.error(errorMessage(err, 'Failed to revert to company rules'));
        } finally {
            setSaving(false);
        }
    };

    const handleRunNow = async () => {
        if (!companyId) return;
        setRunning(true);
        try {
            const result = await api.runNow(companyId);
            if (!result.sendingEnabled) toast.info('Sending is turned off. Turn it on and save first.');
            else toast.success(result.sent ? `Sent ${result.sent} notification${result.sent === 1 ? '' : 's'}` : 'Nothing is due right now');
            loadLog();
        } catch (err) {
            toast.error(errorMessage(err, 'Failed to send notifications'));
        } finally {
            setRunning(false);
        }
    };

    const handleAddRule = () => {
        setIsNewRule(true);
        setEditingRule(null);
        setModalFormData(emptyRule());
        setRecipientInput("");
        setModalError(null);
        setShowModal(true);
    };

    const handleEditRule = (rule: NotificationRule) => {
        setIsNewRule(false);
        setEditingRule(rule);
        setModalFormData(rule);
        setRecipientInput("");
        setModalError(null);
        setShowModal(true);
    };

    const handleDuplicateRule = (rule: NotificationRule) => {
        setIsNewRule(true);
        setEditingRule(null);
        setModalFormData({ ...rule, name: `${rule.name} (copy)`, audience: activeAudience ?? rule.audience });
        setRecipientInput("");
        setModalError(null);
        setShowModal(true);
    };

    const handleDeleteRule = (ruleId: number) => {
        if (window.confirm("Are you sure you want to delete this notification rule?")) {
            updateRules(notificationRules.filter(rule => rule.id !== ruleId));
        }
    };

    const handleSaveRule = () => {
        // A typed but un-added recipient is almost always meant to be added.
        const pending = recipientInput.trim();
        const formData = pending && modalFormData.notifyCompany && !modalFormData.recipients?.includes(pending)
            ? { ...modalFormData, recipients: [...(modalFormData.recipients || []), pending] }
            : modalFormData;
        const problem = ruleProblem(formData);
        if (problem) {
            setModalFormData(formData);
            setRecipientInput("");
            setModalError(problem);
            return;
        }
        if (isNewRule) {
            updateRules([...notificationRules, { ...formData as NotificationRule, id: newRuleId(notificationRules) }]);
        } else if (editingRule) {
            updateRules(
                notificationRules.map(rule =>
                    rule.id === editingRule.id ? { ...formData as NotificationRule, id: rule.id } : rule
                )
            );
        }
        setShowModal(false);
    };

    const handleToggleRule = (ruleId: number) => {
        updateRules(
            notificationRules.map(rule =>
                rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
            )
        );
    };

    const handleAddRecipient = (recipient: string) => {
        const value = recipient.trim().toLowerCase();
        if (!value) return;
        if (!EMAIL_RE.test(value)) {
            setModalError(`"${recipient}" is not a valid email address.`);
            return;
        }
        if (!modalFormData.recipients?.includes(value)) {
            setModalFormData({
                ...modalFormData,
                recipients: [...(modalFormData.recipients || []), value],
            });
        }
        setModalError(null);
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

    const handleAudienceTypeChange = (type: RuleAudience['type']) => {
        setModalFormData(prev => ({
            ...prev,
            audience: type === 'positions'
                ? { type, jobIds: prev.audience?.type === 'positions' ? prev.audience.jobIds : [] }
                : { type },
        }));
    };

    const togglePosition = (jobId: number, checked: boolean) => {
        setModalFormData(prev => {
            const current = prev.audience?.type === 'positions' ? prev.audience.jobIds : [];
            return { ...prev, audience: { type: 'positions', jobIds: checked ? [...current, jobId] : current.filter(id => id !== jobId) } };
        });
    };

    const visibleRules = activeAudience
        ? notificationRules.filter((r) => sameAudience(r.audience ?? { type: 'all' }, activeAudience))
        : notificationRules;

    const filterOptions: { key: string; label: string }[] = [
        { key: '', label: 'All rules' },
        { key: 'all', label: 'All employees' },
        { key: 'owner_operators', label: 'Owner operators' },
        { key: 'company_drivers', label: 'Company drivers' },
        ...jobs
            .filter((j) => filterKey === `position:${j.id}` || notificationRules.some((r) => r.audience?.type === 'positions' && r.audience.jobIds.includes(j.id)))
            .map((j) => ({ key: `position:${j.id}`, label: j.title })),
    ];
    if (activeAudience && !filterOptions.some((o) => o.key === filterKey)) {
        filterOptions.push({ key: filterKey, label: audienceLabel(activeAudience, jobs) });
    }

    const driverGroup = employeeInfo
        ? [employeeInfo.is_owner_operator ? 'Owner operator' : 'Company driver', employeeInfo.jobTitle].filter(Boolean).join(' · ')
        : '';

    const accentStyle = { width: '8px', height: '24px', backgroundColor: 'rgb(0, 96, 120)', marginRight: '0.75rem', borderRadius: '2px' } as const;

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <Spinner animation="border" size="sm" className="mr-2" />
                <span>Loading notification settings...</span>
            </div>
        );
    }

    if (loadError) {
        return (
            <Alert variant="danger" className="d-flex justify-content-between align-items-center">
                <span>Couldn&apos;t load notification settings.</span>
                <Button size="sm" variant="outline-danger" onClick={load}>Try again</Button>
            </Alert>
        );
    }

    return (
        <div className="employee_directory_tabs">
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, rgb(0, 96, 120) 0%, rgb(29, 67, 84) 100%)',
                borderRadius: '0.5rem',
                padding: '1.25rem 1.5rem',
                marginBottom: '1.5rem',
            }}>
                <div className="d-flex justify-content-between align-items-start" style={{ gap: '1rem' }}>
                    <div>
                        <h5 style={{ color: '#fff', margin: 0, fontWeight: 600, fontSize: '1.125rem' }}>
                            {isGlobalMode
                                ? 'Company-wide Employee Notification Settings'
                                : `Notification Settings for ${employee.first_name} ${employee.last_name}`}
                        </h5>
                        <p style={{ color: '#fff', margin: '0.5rem 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
                            {isGlobalMode
                                ? 'Rules apply to every employee they are aimed at, unless a driver has their own rules.'
                                : custom
                                    ? `${employee.first_name} has their own rules. Company-wide rules do not apply to them.`
                                    : `${employee.first_name} follows the company-wide rules for their group${driverGroup ? ` (${driverGroup})` : ''}.`}
                        </p>
                    </div>
                    {isGlobalMode && (
                        <Form.Check
                            type="switch"
                            id="sending-enabled"
                            className="text-white text-nowrap"
                            label={<span style={{ color: '#fff', fontWeight: 600 }}>Send notifications</span>}
                            checked={sendingEnabled}
                            disabled={!canEdit}
                            onChange={(e) => { setSendingEnabled(e.target.checked); setDirty(true); }}
                        />
                    )}
                </div>
            </div>

            {!savedSendingEnabled && (
                <Alert variant="warning" style={{ fontSize: '0.875rem' }}>
                    {isGlobalMode
                        ? sendingEnabled
                            ? 'Sending will start once you save. Reminders that are already due go out within the hour.'
                            : 'Sending is off: no emails or texts go out for any employee. Turn on "Send notifications" and save to start.'
                        : <>Sending is off for the company, so these rules are not being sent yet. <Link href="/dashboard/company/compliance/employee-directory?tab=notifications">Open company-wide settings</Link> to turn it on.</>}
                </Alert>
            )}

            {!isGlobalMode && employeeInfo && (!employeeInfo.hasEmail || !employeeInfo.hasMobile) && (
                <Alert variant="info" style={{ fontSize: '0.875rem' }}>
                    {!employeeInfo.hasEmail && !employeeInfo.hasMobile
                        ? `${employee.first_name} has no email or mobile number on file, so driver reminders can't be delivered.`
                        : !employeeInfo.hasEmail
                            ? `${employee.first_name} has no email on file; driver reminders will go by SMS only.`
                            : `${employee.first_name} has no valid mobile number on file; driver reminders will go by email only.`}
                    {' '}Staff emails are unaffected.
                </Alert>
            )}

            {/* Group filter (company-wide) */}
            {isGlobalMode && (
                <div className="d-flex align-items-center flex-wrap mb-3" style={{ gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#6c757d', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <People size={14} /> Showing rules for:
                    </span>
                    {filterOptions.map((o) => (
                        <Button
                            key={o.key || 'every-rule'}
                            size="sm"
                            variant={filterKey === o.key ? 'primary' : 'outline-secondary'}
                            style={filterKey === o.key ? { backgroundColor: 'rgb(0, 96, 120)', border: 'none' } : undefined}
                            onClick={() => setFilterKey(o.key)}
                        >
                            {o.label}
                        </Button>
                    ))}
                </div>
            )}

            {/* Notification Rules */}
            <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', padding: '1.5rem', border: '1px solid #dee2e6' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 style={{ fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center' }}>
                        <span style={accentStyle}></span>
                        {isGlobalMode
                            ? activeAudience ? `Rules for ${audienceLabel(activeAudience, jobs).toLowerCase()}` : 'Notification Rules'
                            : custom ? `${employee.first_name}'s rules` : 'Company-wide rules that apply'}
                    </h6>
                    <div className="d-flex" style={{ gap: '0.5rem' }}>
                        {!isGlobalMode && canEdit && !custom && (
                            <Button size="sm" variant="outline-primary" onClick={handleCustomize}>
                                Customize for {employee.first_name}
                            </Button>
                        )}
                        {canEditRules && (
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
                </div>

                {activeAudience && activeAudience.type !== 'all' && (
                    <p style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '-0.5rem' }}>
                        Rules for all employees also reach this group. To give this group different settings, narrow the all-employee rule to the other group and add one here.
                    </p>
                )}

                {visibleRules.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6c757d' }}>
                        <p>{activeAudience ? 'No rules for this group yet.' : 'No notification rules configured yet.'}</p>
                        {canEditRules && (
                            <Button variant="outline-primary" size="sm" onClick={handleAddRule}>
                                Create {activeAudience ? 'a rule for this group' : 'your first rule'}
                            </Button>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {visibleRules.map((rule) => (
                            <div
                                key={rule.id}
                                style={{
                                    border: '1px solid #dee2e6',
                                    borderRadius: '0.375rem',
                                    padding: '1rem',
                                    backgroundColor: rule.enabled ? '#fff' : '#f8f9fa',
                                    opacity: rule.enabled ? 1 : 0.7,
                                    cursor: canEditRules ? 'pointer' : 'default',
                                    transition: 'all 0.2s',
                                }}
                                onClick={() => canEditRules && handleEditRule(rule)}
                                onMouseEnter={(e) => {
                                    if (canEditRules) {
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,96,120,0.15)';
                                        e.currentTarget.style.borderColor = 'rgb(0, 96, 120)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (canEditRules) {
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.borderColor = '#dee2e6';
                                    }
                                }}
                            >
                                <div className="d-flex justify-content-between align-items-start">
                                    <div style={{ flex: 1 }}>
                                        <div className="d-flex align-items-center flex-wrap mb-2" style={{ gap: '0.4rem' }}>
                                            <h6 style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>{rule.name}</h6>
                                            <Badge
                                                bg={rule.documentType === "Commercial Driver's License" ? "primary" :
                                                    rule.documentType === "Medical Certificate" ? "success" : "info"}
                                                style={{ fontSize: '0.7rem' }}
                                            >
                                                {rule.documentType}
                                            </Badge>
                                            {isGlobalMode && (
                                                <Badge bg="light" text="dark" style={{ fontSize: '0.7rem', border: '1px solid #ced4da' }}>
                                                    <People size={11} className="mr-1" />
                                                    {audienceLabel(rule.audience, jobs)}
                                                </Badge>
                                            )}
                                            {canEditRules && <PencilSquare size={13} style={{ color: '#adb5bd' }} />}
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
                                                        <strong>On {rule.customStartDate || 'a fixed date'}</strong>
                                                        {rule.frequency > 0 && <span>, repeating every {rule.frequency} {rule.frequencyUnit}</span>}
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
                                                        <strong>Driver</strong> via {rule.driverNotificationMethods.map(m => m === 'sms' ? 'SMS' : 'Email').join(' & ')}
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
                                        {ruleProblem(rule) && (
                                            <div style={{ fontSize: '0.8rem', color: '#dc3545', marginTop: '0.25rem' }}>
                                                Needs attention: {ruleProblem(rule)}
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
                                            disabled={!canEditRules}
                                        />
                                        {canEditRules && isGlobalMode && (
                                            <Button
                                                variant="link"
                                                size="sm"
                                                title="Duplicate (e.g. for another group)"
                                                onClick={(e) => { e.stopPropagation(); handleDuplicateRule(rule); }}
                                                style={{ color: '#6c757d', padding: '0.25rem' }}
                                            >
                                                <Files size={15} />
                                            </Button>
                                        )}
                                        {canEditRules && (
                                            <Button
                                                variant="link"
                                                size="sm"
                                                title="Delete"
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

            {/* Actions */}
            <div className="d-flex justify-content-between align-items-center flex-wrap mt-4" style={{ gap: '0.75rem' }}>
                <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
                    {!isGlobalMode && canEdit && custom && (
                        <Button variant="outline-secondary" disabled={saving} onClick={handleRevert}>
                            Use company-wide rules instead
                        </Button>
                    )}
                    {isGlobalMode && canEdit && savedSendingEnabled && (
                        <Button variant="outline-secondary" disabled={running || dirty} onClick={handleRunNow} title={dirty ? 'Save your changes first' : undefined}>
                            {running ? <Spinner animation="border" size="sm" className="mr-2" /> : <Send size={14} className="mr-2" />}
                            Send due notifications now
                        </Button>
                    )}
                </div>
                {(isGlobalMode || custom) && (
                    <div className="d-flex align-items-center" style={{ gap: '0.75rem' }}>
                        {dirty && <span style={{ fontSize: '0.85rem', color: '#856404' }}>Unsaved changes</span>}
                        <Button
                            style={{ backgroundColor: 'rgb(0, 96, 120)', border: 'none', padding: '0.5rem 2rem' }}
                            disabled={!canEdit || saving || !dirty}
                            onClick={handleSaveSettings}
                        >
                            {saving ? (
                                <>
                                    <Spinner animation="border" size="sm" className="mr-2" />
                                    Saving...
                                </>
                            ) : isGlobalMode ? 'Save Settings' : `Save for ${employee.first_name}`}
                        </Button>
                    </div>
                )}
            </div>

            {/* Recent activity */}
            <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', padding: '1.25rem 1.5rem', border: '1px solid #dee2e6', marginTop: '1.5rem' }}>
                <h6 style={{ fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                    <span style={accentStyle}></span>
                    Recently sent
                </h6>
                {log.length === 0 ? (
                    <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>No notifications sent yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {log.map((entry) => (
                            <div key={entry.id} style={{ fontSize: '0.85rem', borderBottom: '1px solid #f1f3f5', paddingBottom: '0.5rem' }}>
                                <div className="d-flex justify-content-between flex-wrap" style={{ gap: '0.5rem' }}>
                                    <span>
                                        <strong>{STAGE_LABELS[entry.stage]}</strong>: {entry.ruleName}
                                        {entry.status === 'partial' && <Badge bg="warning" text="dark" className="ml-2">Partly sent</Badge>}
                                    </span>
                                    <span className="text-muted">{new Date(entry.created_at).toLocaleString()}</span>
                                </div>
                                <div className="text-muted">
                                    {entry.channels.split(',').filter(Boolean).map((c) => CHANNEL_LABELS[c] ?? c).join(', ')}
                                    {entry.recipients && ` · ${entry.recipients}`}
                                </div>
                                {entry.error && <div style={{ color: '#dc3545' }}>{entry.error}</div>}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Notification Rule Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton closeVariant="white" style={{ backgroundColor: 'rgb(0, 96, 120)', borderBottom: 'none' }}>
                    <Modal.Title style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>
                        {isNewRule ? "Add Notification Rule" : "Edit Notification Rule"}
                        {!isGlobalMode && <span style={{ fontWeight: 400, fontSize: '0.9rem' }}> for {employee.first_name} {employee.last_name}</span>}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ padding: '1.25rem 1.5rem', backgroundColor: '#f8f9fa' }}>
                    <Form>

                        {/* Section: Applies to (company-wide only) */}
                        {isGlobalMode && (
                            <div style={{ backgroundColor: '#fff', border: '1px solid #e9ecef', borderRadius: '0.5rem', padding: '1.25rem', marginBottom: '1rem' }}>
                                <p style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6c757d', marginBottom: '0.75rem' }}>Applies to</p>
                                <div className="d-flex flex-wrap" style={{ gap: '1.25rem' }}>
                                    {([
                                        ['all', 'All employees'],
                                        ['owner_operators', 'Owner operators'],
                                        ['company_drivers', 'Company drivers'],
                                        ['positions', 'Specific positions'],
                                    ] as [RuleAudience['type'], string][]).map(([type, label]) => (
                                        <Form.Check
                                            key={type}
                                            type="radio"
                                            name="rule-audience"
                                            id={`rule-audience-${type}`}
                                            label={label}
                                            checked={(modalFormData.audience?.type ?? 'all') === type}
                                            onChange={() => handleAudienceTypeChange(type)}
                                        />
                                    ))}
                                </div>
                                {modalFormData.audience?.type === 'positions' && (
                                    <div className="mt-3" style={{ maxHeight: '160px', overflowY: 'auto', padding: '0.5rem 0.75rem', border: '1px solid #e9ecef', borderRadius: '0.25rem' }}>
                                        {jobs.length === 0 ? (
                                            <span className="text-muted" style={{ fontSize: '0.85rem' }}>No positions found for your company.</span>
                                        ) : jobs.map((job) => (
                                            <Form.Check
                                                key={job.id}
                                                type="checkbox"
                                                id={`rule-position-${job.id}`}
                                                label={job.title}
                                                checked={modalFormData.audience?.type === 'positions' && modalFormData.audience.jobIds.includes(job.id)}
                                                onChange={(e) => togglePosition(job.id, e.target.checked)}
                                            />
                                        ))}
                                    </div>
                                )}
                                <Form.Text className="text-muted">
                                    Drivers with their own rules (set from their profile) are not affected by company-wide rules.
                                </Form.Text>
                            </div>
                        )}

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
                                                min="0"
                                                value={modalFormData.daysBeforeExpiration}
                                                onChange={(e) => setModalFormData({ ...modalFormData, daysBeforeExpiration: Math.max(0, parseInt(e.target.value) || 0) })}
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
                                                min={modalFormData.startDateType === 'hire_date' ? 1 : 0}
                                                value={modalFormData.frequency}
                                                onChange={(e) => setModalFormData({ ...modalFormData, frequency: Math.max(0, parseInt(e.target.value) || 0) })}
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
                                        <Form.Text className="text-muted">
                                            {modalFormData.startDateType === 'hire_date'
                                                ? 'Starting from the employee’s hire date'
                                                : 'Use 0 to send only once, on the fixed date'}
                                        </Form.Text>
                                    </div>
                                )}

                                {modalFormData.startDateType !== 'expiration_based' && (
                                    <div className="col-md-6">
                                        <Form.Label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Driver has</Form.Label>
                                        <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
                                            <Form.Control
                                                type="number"
                                                min="1"
                                                value={modalFormData.completeWithinDays ?? 14}
                                                onChange={(e) => setModalFormData({ ...modalFormData, completeWithinDays: Math.max(1, parseInt(e.target.value) || 14) })}
                                                style={{ width: '90px' }}
                                            />
                                            <span className="text-muted" style={{ fontSize: '0.875rem' }}>days to complete</span>
                                        </div>
                                        <Form.Text className="text-muted">Sets {'{due_date}'}. Uploading a document to the driver&apos;s file counts as done.</Form.Text>
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
                                    <Form.Text className="text-muted">Sent to the email and phone number on the driver&apos;s profile.</Form.Text>
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
                            {(modalFormData.notifyCompany || modalFormData.notifyIfIncomplete) && (
                                <div style={{ marginLeft: '1.75rem', padding: '0.75rem 1rem', backgroundColor: '#f8f9fa', borderLeft: '3px solid rgb(0, 96, 120)', borderRadius: '0.25rem' }}>
                                    <Form.Label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Staff Email Recipients</Form.Label>
                                    <InputGroup className="mb-2">
                                        <FormControl
                                            placeholder="safety@yourcompany.com"
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
                                        Goes to the driver if the driver is notified, otherwise to company staff. Variables: <code>{'{employee_name}'}</code> <code>{'{days_remaining}'}</code> <code>{'{due_date}'}</code> <code>{'{license_expiry}'}</code> <code>{'{mvr_expiry}'}</code> <code>{'{medical_card_expiry}'}</code> <code>{'{hire_date}'}</code>
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
                            <Form.Text className="text-muted" style={{ fontSize: '0.78rem' }}>
                                For expiration rules, updating the expiration date on the driver&apos;s profile counts as completed.
                            </Form.Text>
                        </div>

                    </Form>
                </Modal.Body>

                <Modal.Footer className="d-flex justify-content-between">
                    <span style={{ color: '#dc3545', fontSize: '0.875rem', flex: 1 }}>{modalError}</span>
                    <div className="d-flex" style={{ gap: '0.5rem' }}>
                        <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button style={{ backgroundColor: 'rgb(0, 96, 120)', border: 'none' }} onClick={handleSaveRule}>Save Rule</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
