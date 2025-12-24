import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Form,
  Modal,
  Alert,
  Badge,
  Spinner,
} from 'react-bootstrap';
import { useAuth } from '../../hooks/use-auth';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/dashboard/layouts/layout/dashboard-layout';
import { Plus, Pencil, Trash, Eye, EyeSlash } from 'react-bootstrap-icons';
import FeatureFlagsApi, { FeatureFlag } from '../api/feature-flags';
import { toast } from 'react-toastify';
import styles from '../admin.module.css';
import { getAdminSidebarItems } from '../../utils/admin-sidebar-config';

interface FeatureFlagFormData {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions: string;
}

const initialFormData: FeatureFlagFormData = {
  key: '',
  name: '',
  description: '',
  enabled: true,
  conditions: '{}',
};

export default function FeatureFlagsAdmin() {
  const { isSuperAdmin } = useAuth();
  const router = useRouter();
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null);
  const [formData, setFormData] = useState<FeatureFlagFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const featureFlagsApi = useMemo(() => new FeatureFlagsApi(), []);

  const loadFlags = useCallback(async () => {
    try {
      setLoading(true);
      const response = await featureFlagsApi.getAll();
      setFlags(response || []);
    } catch (error) {
      console.error('Failed to load feature flags:', error);
      toast.error('Failed to load feature flags');
    } finally {
      setLoading(false);
    }
  }, [featureFlagsApi]);

  useEffect(() => {
    if (!isSuperAdmin) {
      router.push('/dashboard');
      return;
    }
    loadFlags();
  }, [isSuperAdmin, router, loadFlags]);

  const handleCreate = () => {
    setEditingFlag(null);
    setFormData(initialFormData);
    setFormErrors({});
    setShowModal(true);
  };

  const handleEdit = (flag: FeatureFlag) => {
    setEditingFlag(flag);
    setFormData({
      key: flag.key,
      name: flag.name,
      description: flag.description || '',
      enabled: flag.enabled,
      conditions: JSON.stringify(flag.conditions, null, 2),
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleToggleEnabled = async (flag: FeatureFlag) => {
    try {
      await featureFlagsApi.update(flag.id, {
        ...flag,
        enabled: !flag.enabled,
      });
      toast.success(`Feature flag ${!flag.enabled ? 'enabled' : 'disabled'}`);
      loadFlags();
    } catch (error) {
      console.error('Failed to toggle feature flag:', error);
      toast.error('Failed to update feature flag');
    }
  };

  const handleDelete = async (flag: FeatureFlag) => {
    if (!confirm(`Are you sure you want to delete the feature flag "${flag.name}"?`)) {
      return;
    }

    try {
      await featureFlagsApi.delete(flag.id);
      toast.success('Feature flag deleted successfully');
      loadFlags();
    } catch (error) {
      console.error('Failed to delete feature flag:', error);
      toast.error('Failed to delete feature flag');
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.key.trim()) {
      errors.key = 'Key is required';
    } else if (!/^[A-Z_][A-Z0-9_]*$/.test(formData.key)) {
      errors.key = 'Key must be uppercase with underscores (e.g., NEW_FEATURE)';
    }

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    try {
      JSON.parse(formData.conditions);
    } catch (e) {
      errors.conditions = 'Conditions must be valid JSON';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const submitData = {
        ...formData,
        conditions: JSON.parse(formData.conditions),
      };

      if (editingFlag) {
        await featureFlagsApi.update(editingFlag.id, submitData);
        toast.success('Feature flag updated successfully');
      } else {
        await featureFlagsApi.create(submitData);
        toast.success('Feature flag created successfully');
      }

      setShowModal(false);
      loadFlags();
    } catch (error) {
      console.error('Failed to save feature flag:', error);
      toast.error('Failed to save feature flag');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormChange = (field: keyof FeatureFlagFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Feature Flags</h1>
          <p className="text-muted mb-0">Manage application feature flags and rollouts</p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          <Plus size={16} className="me-2" />
          Create Flag
        </Button>
      </div>

      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : flags.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-3">No feature flags found</p>
              <Button variant="outline-primary" onClick={handleCreate}>
                <Plus size={16} className="me-2" />
                Create Your First Flag
              </Button>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Key</th>
                  <th>Name</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {flags.map((flag) => (
                  <tr key={flag.id}>
                    <td>
                      <Badge bg={flag.enabled ? 'success' : 'secondary'}>
                        {flag.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </td>
                    <td>
                      <code className="small">{flag.key}</code>
                    </td>
                    <td>
                      <div>
                        <div className="fw-medium">{flag.name}</div>
                        <small className="text-muted">{flag.description}</small>
                      </div>
                    </td>
                    <td>
                      <small className="text-muted">
                        {new Date(flag.updated_at).toLocaleDateString()}
                      </small>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleToggleEnabled(flag)}
                          title={flag.enabled ? 'Disable' : 'Enable'}
                        >
                          {flag.enabled ? <EyeSlash size={14} /> : <Eye size={14} />}
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEdit(flag)}
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(flag)}
                          title="Delete"
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingFlag ? 'Edit Feature Flag' : 'Create Feature Flag'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Key *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="NEW_FEATURE"
                    value={formData.key}
                    onChange={(e) => handleFormChange('key', e.target.value.toUpperCase())}
                    isInvalid={!!formErrors.key}
                    disabled={!!editingFlag}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.key}</Form.Control.Feedback>
                  <Form.Text className="text-muted">Uppercase with underscores only</Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="New Feature"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    isInvalid={!!formErrors.name}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Describe what this feature flag controls"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                isInvalid={!!formErrors.description}
              />
              <Form.Control.Feedback type="invalid">{formErrors.description}</Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <div className="d-flex align-items-center">
                    <Form.Check
                      type="switch"
                      id="enabled-switch"
                      label="Enabled"
                      checked={formData.enabled}
                      onChange={(e) => handleFormChange('enabled', e.target.checked)}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Conditions (JSON)</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="{}"
                value={formData.conditions}
                onChange={(e) => handleFormChange('conditions', e.target.value)}
                isInvalid={!!formErrors.conditions}
                style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
              />
              <Form.Control.Feedback type="invalid">{formErrors.conditions}</Form.Control.Feedback>
              <Form.Text className="text-muted">
                Advanced targeting conditions in JSON format
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {editingFlag ? 'Updating...' : 'Creating...'}
                </>
              ) : editingFlag ? (
                'Update Flag'
              ) : (
                'Create Flag'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

FeatureFlagsAdmin.getLayout = function getLayout(page) {
  return (
    <DashboardLayout sidebarItems={getAdminSidebarItems('Feature Flags')}>{page}</DashboardLayout>
  );
};
