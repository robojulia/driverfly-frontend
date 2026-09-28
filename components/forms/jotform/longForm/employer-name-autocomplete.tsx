import React, { useEffect, useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { CheckCircleFill } from 'react-bootstrap-icons';
import CompanyApi, { FmcsaCarrier } from '../../../../pages/api/company';
import stateList from '../../../../utils/stateList';
import { Input } from '../../../shared/dha';

const MIN_SEARCH_LENGTH = 3;
const SEARCH_DELAY_MS = 350;

export interface FmcsaEmployerFields {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
}

/**
 * Maps an FMCSA census record onto the employer form fields. Fields FMCSA has no value for are left
 * out, so whatever the driver already typed there stays.
 */
export function fmcsaCarrierToEmployerFields(
  carrier: FmcsaCarrier,
  searchTerm = ''
): FmcsaEmployerFields {
  const fields: FmcsaEmployerFields = { name: carrierDisplayName(carrier, searchTerm) };

  if (carrier.phy_street) fields.address = carrier.phy_street;
  if (carrier.phy_city) fields.city = carrier.phy_city;
  // The state dropdown only lists US states; don't set a value it can't show.
  if (carrier.phy_state && stateList.some((s) => s.value === carrier.phy_state)) {
    fields.state = carrier.phy_state;
  }
  if (carrier.phy_zip) fields.zip_code = carrier.phy_zip.slice(0, 5);

  // The phone input stores the country code too; FMCSA gives 10 bare digits.
  const digits = (carrier.phone || '').replace(/\D/g, '');
  if (digits.length === 10) fields.phone = `1${digits}`;
  else if (digits.length === 11 && digits.startsWith('1')) fields.phone = digits;

  if (carrier.email_address) fields.email = carrier.email_address.toLowerCase();
  return fields;
}

/** Drivers often know a carrier by its DBA; use it when that's what they typed. */
function carrierDisplayName(carrier: FmcsaCarrier, searchTerm: string): string {
  const typed = searchTerm.trim().toUpperCase();
  const dbaMatches = carrier.dba_name && typed && carrier.dba_name.toUpperCase().includes(typed);
  const legalMatches = carrier.legal_name && typed && carrier.legal_name.toUpperCase().includes(typed);
  if (dbaMatches && !legalMatches) return carrier.dba_name;
  return carrier.legal_name || carrier.dba_name || '';
}

interface EmployerNameAutocompleteProps {
  name: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  /** Called with the chosen carrier's fields; the parent writes them into the form. */
  onSelectCarrier: (fields: FmcsaEmployerFields) => void;
}

/**
 * Company name input that suggests FMCSA-registered carriers as the driver types. Picking one fills
 * in the address, phone and email so the VOE request can go out automatically. The suggestions are
 * optional: whatever the driver types is kept if nothing matches, and every filled field stays
 * editable.
 */
export function EmployerNameAutocomplete({
  name,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required,
  onSelectCarrier,
}: EmployerNameAutocompleteProps) {
  const [results, setResults] = useState<FmcsaCarrier[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [searchedTerm, setSearchedTerm] = useState('');
  const [filledFrom, setFilledFrom] = useState<FmcsaCarrier | null>(null);

  // Only search on the driver's own keystrokes, not when the value is loaded or filled in.
  const typedRef = useRef(false);
  const requestRef = useRef(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!typedRef.current) return;
    const term = (value || '').trim();
    if (term.length < MIN_SEARCH_LENGTH) {
      requestRef.current++;
      setResults([]);
      setLoading(false);
      setOpen(false);
      return;
    }

    const requestId = ++requestRef.current;
    setLoading(true);
    setOpen(true);
    const timer = setTimeout(async () => {
      let records: FmcsaCarrier[] = [];
      try {
        records = (await new CompanyApi().fmcsaCompanySearch(term)).records ?? [];
      } catch {
        // Lookup is a convenience; on failure the driver just enters the details by hand.
      }
      if (requestId !== requestRef.current) return;
      setResults(records);
      setSearchedTerm(term);
      setHighlighted(-1);
      setLoading(false);
    }, SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const select = (carrier: FmcsaCarrier) => {
    typedRef.current = false;
    requestRef.current++;
    setOpen(false);
    setLoading(false);
    setFilledFrom(carrier);
    onSelectCarrier(fmcsaCarrierToEmployerFields(carrier, searchedTerm));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    typedRef.current = true;
    setFilledFrom(null);
    onChange(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown' && results.length) {
      e.preventDefault();
      setHighlighted((h) => (h + 1) % results.length);
    } else if (e.key === 'ArrowUp' && results.length) {
      e.preventDefault();
      setHighlighted((h) => (h <= 0 ? results.length - 1 : h - 1));
    } else if (e.key === 'Enter' && highlighted >= 0 && results[highlighted]) {
      e.preventDefault();
      select(results[highlighted]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const showNoMatch = !loading && results.length === 0 && searchedTerm === (value || '').trim();

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }} onKeyDown={handleKeyDown}>
      <Input
        name={name}
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        required={required}
        error={error}
        autoComplete="off"
        helperText={
          filledFrom
            ? undefined
            : 'Start typing to search FMCSA-registered companies, or enter the name yourself'
        }
      />

      {filledFrom && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginTop: '-0.75rem',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
          }}
        >
          <CheckCircleFill style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span>
            Filled from FMCSA (USDOT {filledFrom.dot_number})
            {filledFrom.email_address ? '' : ', no email on file'}. Edit anything that&apos;s out
            of date.
          </span>
        </div>
      )}

      {open && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '-0.75rem',
            zIndex: 20,
            backgroundColor: 'var(--light)',
            border: '1px solid var(--medium-gray)',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            maxHeight: '320px',
            overflowY: 'auto',
          }}
        >
          {loading && (
            <div style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <Spinner animation="border" size="sm" style={{ marginRight: '0.5rem' }} />
              Searching FMCSA…
            </div>
          )}

          {!loading &&
            results.map((carrier, index) => {
              const displayName = carrierDisplayName(carrier, searchedTerm);
              const otherName =
                displayName === carrier.legal_name ? carrier.dba_name : carrier.legal_name;
              return (
                <div
                  key={carrier.dot_number || index}
                  role="option"
                  aria-selected={index === highlighted}
                  // mousedown, not click, so the input's blur doesn't close the list first
                  onMouseDown={(e) => {
                    e.preventDefault();
                    select(carrier);
                  }}
                  onMouseEnter={() => setHighlighted(index)}
                  style={{
                    padding: '0.6rem 1rem',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--medium-gray)',
                    backgroundColor: index === highlighted ? 'var(--form-info-bg)' : 'transparent',
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {displayName}
                    {otherName && otherName !== displayName && (
                      <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>
                        {' '}
                        ({otherName})
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {[carrier.phy_city, carrier.phy_state].filter(Boolean).join(', ')}
                    {carrier.dot_number && ` · USDOT ${carrier.dot_number}`}
                    {carrier.status_code === 'I' && ' · inactive'}
                  </div>
                </div>
              );
            })}

          {showNoMatch && (
            <div style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              No FMCSA match. We&apos;ll use the name you typed; please fill in the contact
              details below.
            </div>
          )}

          {!loading && results.length > 0 && (
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                setOpen(false);
              }}
              style={{
                padding: '0.6rem 1rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
              }}
            >
              Not listed? Keep &ldquo;{(value || '').trim()}&rdquo; and enter the details yourself
            </div>
          )}
        </div>
      )}
    </div>
  );
}
