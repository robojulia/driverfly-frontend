import { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { Robot, LightbulbFill, CheckLg, XLg } from 'react-bootstrap-icons';
import axios from 'axios';
import { toast } from 'react-toastify';

export interface AiNoteLogProps {
  profileType: 'applicant' | 'employee';
  profile: Record<string, any>;
  onSaveNote: (text: string) => Promise<void>;
}

export function AiNoteLog({ profileType, profile, onSaveNote }: AiNoteLogProps) {
  const [generating, setGenerating] = useState(false);
  const [generatedNote, setGeneratedNote] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    setGeneratedNote(null);
    try {
      const { data } = await axios.post('/api/ai-note-generate', {
        profileType,
        profile,
      });
      setGeneratedNote(data.note);
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to generate AI note';
      toast.error(msg);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedNote) return;
    setSaving(true);
    try {
      await onSaveNote(`[AI] ${generatedNote}`);
      setGeneratedNote(null);
      toast.success('AI note saved to log');
    } catch {
      toast.error('Failed to save AI note');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => setGeneratedNote(null);

  return (
    <div
      style={{
        border: '1px solid #c5b4e3',
        borderLeft: '4px solid #6f42c1',
        borderRadius: '6px',
        backgroundColor: '#faf8ff',
        padding: '1rem',
        marginBottom: '1rem',
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="fw-semibold" style={{ color: '#6f42c1', fontSize: '0.95rem' }}>
          <Robot className="me-2" />
          AI Note Generator
        </span>
        <Button
          size="sm"
          variant="outline-secondary"
          style={{ borderColor: '#6f42c1', color: '#6f42c1' }}
          onClick={handleGenerate}
          disabled={generating || saving}
        >
          {generating ? (
            <>
              <Spinner size="sm" animation="border" className="me-1" />
              Generating...
            </>
          ) : (
            <>
              <LightbulbFill className="me-1" />
              Generate AI Note
            </>
          )}
        </Button>
      </div>

      <small className="text-muted d-block mb-3">
        AI will analyze this profile and generate a summary note you can save to the log.
      </small>

      {generatedNote && (
        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid #d0c4f0',
            borderRadius: '4px',
            padding: '0.75rem',
          }}
        >
          <div className="d-flex align-items-center mb-2">
            <span
              className="badge me-2"
              style={{ backgroundColor: '#6f42c1', fontSize: '0.7rem' }}
            >
              AI Generated
            </span>
            <small className="text-muted">{new Date().toLocaleString()}</small>
          </div>
          <p style={{ whiteSpace: 'pre-wrap', color: '#333', margin: 0, fontSize: '0.9rem' }}>
            {generatedNote}
          </p>
          <div className="d-flex gap-2 mt-3">
            <Button
              size="sm"
              variant="primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Spinner size="sm" animation="border" className="me-1" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckLg className="me-1" />
                  Save to Notes Log
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={handleDiscard}
              disabled={saving}
            >
              <XLg className="me-1" />
              Discard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
