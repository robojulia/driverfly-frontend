import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, Modal } from "react-bootstrap";
import { EmployeeEntity } from "../../../../models/employee/employee.entity";
import JobApi from "../../../../pages/api/job";

interface ConfigureScopeModalProps {
    show: boolean;
    onHide: () => void;
    employee: EmployeeEntity;
    /** Called when the user chooses to configure only this driver. */
    onConfigureDriver: () => void;
}

/**
 * Asked from a driver's notification view: configure notifications for just this driver, or for
 * everyone. "Everyone" then narrows to all employees or one group, and opens the company-wide
 * settings on that group.
 */
export default function ConfigureScopeModal({ show, onHide, employee, onConfigureDriver }: ConfigureScopeModalProps) {
    const router = useRouter();
    const [scope, setScope] = useState<'driver' | 'everyone'>('driver');
    const [everyone, setEveryone] = useState<'all' | 'group'>('all');
    const ownGroup = employee.is_owner_operator ? 'owner_operators' : 'company_drivers';
    const [group, setGroup] = useState<string>(ownGroup);
    const [jobs, setJobs] = useState<{ id: number; title: string }[]>([]);

    useEffect(() => {
        if (!show) return;
        setScope('driver');
        setEveryone('all');
        setGroup(ownGroup);
    }, [show, ownGroup]);

    useEffect(() => {
        if (!show || scope !== 'everyone' || jobs.length) return;
        new JobApi().list({ limit: 200 } as any)
            .then((result: any) => {
                const items = Array.isArray(result) ? result : result?.items ?? [];
                setJobs(items.filter((j: any) => j?.id).map((j: any) => ({ id: j.id, title: j.title || `Position #${j.id}` })));
            })
            .catch(() => setJobs([]));
    }, [show, scope, jobs.length]);

    const handleContinue = () => {
        onHide();
        if (scope === 'driver') {
            onConfigureDriver();
            return;
        }
        const audience = everyone === 'all' ? 'all' : group;
        router.push(`/dashboard/company/compliance/employee-directory?tab=notifications&audience=${encodeURIComponent(audience)}`);
    };

    const name = employee.first_name || 'this driver';
    const jobId = employee.job?.id;

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton closeVariant="white" style={{ backgroundColor: 'rgb(0, 96, 120)', borderBottom: 'none' }}>
                <Modal.Title style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>Configure notifications</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Who are you configuring notifications for?</p>
                <Form.Check
                    type="radio"
                    name="notification-scope"
                    id="notification-scope-driver"
                    className="mb-2"
                    checked={scope === 'driver'}
                    onChange={() => setScope('driver')}
                    label={<><strong>Only {employee.first_name} {employee.last_name}</strong><div className="text-muted" style={{ fontSize: '0.85rem' }}>Give this driver their own rules. Company-wide rules stop applying to them.</div></>}
                />
                <Form.Check
                    type="radio"
                    name="notification-scope"
                    id="notification-scope-everyone"
                    checked={scope === 'everyone'}
                    onChange={() => setScope('everyone')}
                    label={<><strong>Everyone</strong><div className="text-muted" style={{ fontSize: '0.85rem' }}>Change the company-wide rules.</div></>}
                />

                {scope === 'everyone' && (
                    <div style={{ marginLeft: '1.75rem', marginTop: '0.75rem', padding: '0.75rem 1rem', backgroundColor: '#f0f8ff', borderLeft: '3px solid rgb(0, 96, 120)', borderRadius: '0.25rem' }}>
                        <Form.Check
                            type="radio"
                            name="notification-everyone"
                            id="notification-everyone-all"
                            className="mb-2"
                            checked={everyone === 'all'}
                            onChange={() => setEveryone('all')}
                            label="All employees"
                        />
                        <Form.Check
                            type="radio"
                            name="notification-everyone"
                            id="notification-everyone-group"
                            checked={everyone === 'group'}
                            onChange={() => setEveryone('group')}
                            label="A specific group"
                        />
                        {everyone === 'group' && (
                            <Form.Select className="mt-2" value={group} onChange={(e) => setGroup(e.target.value)}>
                                <option value="owner_operators">
                                    Owner operators{employee.is_owner_operator ? ` (${name}'s group)` : ''}
                                </option>
                                <option value="company_drivers">
                                    Company drivers{!employee.is_owner_operator ? ` (${name}'s group)` : ''}
                                </option>
                                {jobs.length > 0 && (
                                    <optgroup label="Position">
                                        {jobs.map((job) => (
                                            <option key={job.id} value={`position:${job.id}`}>
                                                {job.title}{job.id === jobId ? ` (${name}'s position)` : ''}
                                            </option>
                                        ))}
                                    </optgroup>
                                )}
                            </Form.Select>
                        )}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide}>Cancel</Button>
                <Button style={{ backgroundColor: 'rgb(0, 96, 120)', border: 'none' }} onClick={handleContinue}>Continue</Button>
            </Modal.Footer>
        </Modal>
    );
}
