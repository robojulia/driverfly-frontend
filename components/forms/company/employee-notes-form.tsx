import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "../../../hooks/use-translation";
import { EmployeeEntity } from "../../../models/employee/employee.entity";
import { EmployeeNoteEntity } from "../../../models/employee/employee-note.entity";
import EmployeeApi from "../../../pages/api/employee";
import Section from "../../view-details/section";
import { BaseFormProps } from "./base-form-props";
import { AiNoteLog } from "../../ai-note-log/AiNoteLog";

export interface EmployeeNotesFormProps extends BaseFormProps<EmployeeEntity> {
  hideActions?: boolean;
}

export function EmployeeNotesForm(props: EmployeeNotesFormProps) {
  const { t } = useTranslation();
  const { entity, setEntity } = props;
  const employeeApi = new EmployeeApi();

  const [notes, setNotes] = useState<EmployeeNoteEntity[]>(entity?.notes || []);
  const [newNoteText, setNewNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingNoteText, setEditingNoteText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update notes when entity changes
  useEffect(() => {
    if (entity?.notes) {
      setNotes(entity.notes);
    }
  }, [entity?.notes]);

  const handleAiSaveNote = async (text: string) => {
    if (!entity?.id) throw new Error('Employee must be saved first');
    const newNote = await employeeApi.notes.create(entity.id, { text } as EmployeeNoteEntity);
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    if (setEntity) setEntity({ ...entity, notes: updatedNotes });
  };

  const handleAddNote = async () => {
    if (!entity?.id) {
      toast.error(t('Employee must be saved first'));
      return;
    }

    if (!newNoteText.trim()) {
      toast.error(t('Please enter a note'));
      return;
    }

    setIsSubmitting(true);
    try {
      const newNote = await employeeApi.notes.create(entity.id, { text: newNoteText } as EmployeeNoteEntity);
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      setNewNoteText("");
      toast.success(t('HR note logged successfully'));

      // Update entity
      if (setEntity) {
        setEntity({ ...entity, notes: updatedNotes });
      }
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error(t('Failed to log HR note'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditNote = (note: EmployeeNoteEntity) => {
    setEditingNoteId(note.id);
    setEditingNoteText(note.text || "");
  };

  const handleSaveEdit = async (noteId: number) => {
    if (!editingNoteText.trim()) {
      toast.error(t('Please enter a note'));
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedNote = await employeeApi.notes.update(
        entity.id,
        noteId,
        { text: editingNoteText } as EmployeeNoteEntity
      );

      const updatedNotes = notes.map(note =>
        note.id === noteId ? updatedNote : note
      );
      setNotes(updatedNotes);
      setEditingNoteId(null);
      setEditingNoteText("");
      toast.success(t('HR note updated successfully'));

      // Update entity
      if (setEntity) {
        setEntity({ ...entity, notes: updatedNotes });
      }
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error(t('Failed to update HR note'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingNoteText("");
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm(t('Are you sure you want to delete this HR note?'))) {
      return;
    }

    setIsSubmitting(true);
    try {
      await employeeApi.notes.remove(entity.id, noteId);
      const updatedNotes = notes.filter(note => note.id !== noteId);
      setNotes(updatedNotes);
      toast.success(t('HR note deleted successfully'));

      // Update entity
      if (setEntity) {
        setEntity({ ...entity, notes: updatedNotes });
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error(t('Failed to delete HR note'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <>
      <Section title="HR Notes">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <small className="text-muted">All HR notes are timestamped and preserved as records</small>
          </div>

          {/* AI Note Generator */}
          {entity?.id && (
            <AiNoteLog
              profileType="employee"
              profile={entity as Record<string, any>}
              onSaveNote={handleAiSaveNote}
            />
          )}

          {/* Add new note */}
          {entity?.id && (
            <div className="mb-3 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px dashed #ced4da' }}>
              <label className="form-label fw-bold small">Add New HR Note</label>
              <textarea
                className="form-control mb-2"
                rows={3}
                placeholder="Enter your HR note here..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                disabled={isSubmitting}
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddNote}
                disabled={isSubmitting || !newNoteText.trim()}
              >
                {isSubmitting ? 'Logging Note...' : 'Log HR Note'}
              </Button>
            </div>
          )}

          {/* List of logged notes */}
          {notes && notes.length > 0 ? (
            <div className="notes-list">
              <small className="text-muted d-block mb-2">
                {notes.length} HR note{notes.length !== 1 ? 's' : ''} recorded
              </small>
              {notes.sort((a, b) => {
                const dateA = new Date(b.created_at || 0).getTime();
                const dateB = new Date(a.created_at || 0).getTime();
                return dateA - dateB;
              }).map((note) => (
                <div
                  key={note.id}
                  className="mb-3 p-3"
                  style={{
                    border: '1px solid #dee2e6',
                    borderLeft: '4px solid #1d4354',
                    borderRadius: '4px',
                    backgroundColor: '#fff',
                    position: 'relative'
                  }}
                >
                  {/* Timestamp badge */}
                  <div className="mb-2">
                    <span
                      className="badge"
                      style={{ backgroundColor: '#e7f1ff', color: '#1d4354', fontSize: '0.75rem', fontWeight: 'normal' }}
                    >
                      Logged: {formatDate(note.created_at)}
                      {note.user?.first_name && ` by ${note.user.first_name} ${note.user.last_name || ''}`.trim()}
                    </span>
                    {note.last_updated_at && note.last_updated_at !== note.created_at && (
                      <span
                        className="badge ms-2"
                        style={{ backgroundColor: '#fff3cd', color: '#856404', fontSize: '0.75rem', fontWeight: 'normal' }}
                      >
                        Edited: {formatDate(note.last_updated_at)}
                      </span>
                    )}
                  </div>

                  {editingNoteId === note.id ? (
                    // Edit mode
                    <>
                      <label className="form-label small fw-bold">Edit HR Note Content</label>
                      <textarea
                        className="form-control mb-2"
                        rows={3}
                        value={editingNoteText}
                        onChange={(e) => setEditingNoteText(e.target.value)}
                        disabled={isSubmitting}
                      />
                      <div className="d-flex gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleSaveEdit(note.id)}
                          disabled={isSubmitting || !editingNoteText.trim()}
                        >
                          {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleCancelEdit}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                      </div>
                      <small className="text-muted d-block mt-2">
                        Note: The original log timestamp will be preserved
                      </small>
                    </>
                  ) : (
                    // View mode
                    <>
                      <div className="mb-2" style={{ whiteSpace: 'pre-wrap', color: '#333' }}>
                        {note.text}
                      </div>
                      <div className="d-flex gap-2 mt-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEditNote(note)}
                          disabled={isSubmitting}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteNote(note.id)}
                          disabled={isSubmitting}
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <p className="text-muted mb-0">No HR notes have been logged yet</p>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
