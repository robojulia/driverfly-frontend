import { toast } from 'react-toastify';

import { useFormik } from 'formik';
import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from '../../../hooks/use-translation';
import { useUnsavedChangesWarning } from '../../../hooks/use-unsaved-changes-warning';

import { Row, Button, ListGroup } from 'react-bootstrap';

import { globalAjaxExceptionHandler } from '../../../utils/ajax';

import EntityForm from '../../layouts/page/entity-form';
import BaseInput from '../base-input';
import StateSelect from '../state-select';

import { LocationEntity } from '../../../models/company/location.entity';
import LocationApi from '../../../pages/api/location';
import MapboxApi from '../../../pages/api/mapbox';
import { BaseFormProps } from './base-form-props';

export interface LocationFormProps extends BaseFormProps<LocationEntity> {}

export function LocationForm(props: LocationFormProps) {
  const { t } = useTranslation();
  let { className, entity, onSaveComplete, onSaveError } = props;
  const [error, setError] = useState<string>();
  const [addressSearch, setAddressSearch] = useState<string>('');
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const form = useFormik({
    initialValues: new LocationEntity(),
    validationSchema: LocationEntity.yupSchema(t),
    onSubmit: async (dto) => {
      const api = new LocationApi();
      try {
        let location = null;
        if (entity?.id) {
          location = await api.update(entity.id, dto);
        } else {
          location = await api.create(dto);
        }
        toast.success(
          t(
            'Forms.SUCCESS_{action}_{name}',
            { action: !!entity?.id ? 'Forms.UPDATED' : 'Forms.CREATED', name: 'TERMINAL' },
            { translateProps: true }
          )
        );
        // Reset dirty state after successful save to prevent unsaved changes warning
        form.resetForm({ values: location });
        if (onSaveComplete) onSaveComplete(location);
      } catch (e) {
        console.error('Unable to save entity', e);
        globalAjaxExceptionHandler(e, {
          formik: form,
          t: t,
          toast: toast,
          defaultMessage: t(
            'Forms.FAIL_{action}_{name}',
            { action: !!entity?.id ? 'Forms.UPDATED' : 'Forms.CREATED', name: 'TERMINAL' },
            { translateProps: true }
          ),
        });
        if (onSaveError) onSaveError(e);
      }
    },
  });

  const valicateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    const address: string = `${(form.values.street + ' ').trim()}, ${form.values.city}, ${
      form.values.state
    } ${form.values.zip_code}`.trim();

    const mapboxApi = new MapboxApi();
    const results = await mapboxApi.forwardGeocoding(address);
    // console.log({ results });

    if (!!results?.features?.some((v) => v?.relevance == 1)) {
      setError(null);
      form.handleSubmit();
    } else {
      setError('INVALID_LOCATION');
    }
  };

  useEffect(() => {
    if (entity && !form.dirty) form.setValues(entity);
  }, [entity]);

  useEffect(() => {
    setError(null);
  }, [form.values]);

  // Warn user about unsaved changes when navigating away
  const unsavedChangesWarning = useUnsavedChangesWarning({
    isDirty: form.dirty,
    shouldWarn: !form.isSubmitting,
  });

  // Address autocomplete search
  const searchAddress = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const mapboxApi = new MapboxApi();
      const results = await mapboxApi.forwardGeocoding(query);

      if (results?.features) {
        setAddressSuggestions(results.features);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error('Address search error:', err);
    }
  }, []);

  // Handle address selection from autocomplete
  const selectAddress = (feature: any) => {
    // Extract address components from Mapbox feature
    const context = feature.context || [];

    // Get street address
    const street = feature.text || feature.place_name?.split(',')[0] || '';

    // Extract city, state, zip from context
    let city = '';
    let state = '';
    let zipCode = '';

    context.forEach((item: any) => {
      if (item.id?.startsWith('place.')) {
        city = item.text;
      } else if (item.id?.startsWith('region.')) {
        state = item.short_code?.replace('US-', '') || item.text;
      } else if (item.id?.startsWith('postcode.')) {
        zipCode = item.text;
      }
    });

    // If no zip in context, try to extract from place_name
    if (!zipCode && feature.place_name) {
      const zipMatch = feature.place_name.match(/\b\d{5}(?:-\d{4})?\b/);
      if (zipMatch) {
        zipCode = zipMatch[0];
      }
    }

    // Update form values
    form.setValues({
      ...form.values,
      street: street,
      city: city || form.values.city,
      state: state || form.values.state,
      zip_code: zipCode || form.values.zip_code,
    });

    setAddressSearch(feature.place_name);
    setShowSuggestions(false);
  };

  // Debounced address search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (addressSearch) {
        searchAddress(addressSearch);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [addressSearch, searchAddress]);

  // Auto-lookup zip code when city and state change
  const autoLookupZipCode = useCallback(async () => {
    const { city, state, zip_code } = form.values;

    // Only lookup if we have city and state but missing zip code
    if (city && state && !zip_code) {
      try {
        const mapboxApi = new MapboxApi();
        const query = `${city}, ${state}`;
        const results = await mapboxApi.forwardGeocoding(query);

        if (results?.features && results.features.length > 0) {
          const feature = results.features[0];
          const context = feature.context || [];

          let foundZip = '';
          context.forEach((item: any) => {
            if (item.id?.startsWith('postcode.')) {
              foundZip = item.text;
            }
          });

          // Also try to extract from place_name
          if (!foundZip && feature.place_name) {
            const zipMatch = feature.place_name.match(/\b\d{5}(?:-\d{4})?\b/);
            if (zipMatch) {
              foundZip = zipMatch[0];
            }
          }

          if (foundZip) {
            form.setFieldValue('zip_code', foundZip);
            toast.info(`Zip code ${foundZip} auto-filled for ${city}, ${state}`);
          }
        }
      } catch (err) {
        console.error('Auto-lookup zip code error:', err);
      }
    }
  }, [form]);

  // Trigger auto-lookup when city or state changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      autoLookupZipCode();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [form.values.city, form.values.state, autoLookupZipCode]);

  return (
    <>
      {unsavedChangesWarning}
      <EntityForm className={className} onSubmit={valicateLocation} id={entity?.id} formik={form}>
      <>
        {error && <div className="text-danger">{t(error)}</div>}

        {/* Address Search Autocomplete */}
        <Row className="my-2">
          <div className="col-12 mb-3 position-relative">
            <label className="form-label">
              {t('SEARCH_ADDRESS')} <span className="text-muted">(optional - helps auto-fill fields)</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Start typing an address..."
              value={addressSearch}
              onChange={(e) => setAddressSearch(e.target.value)}
              onFocus={() => addressSuggestions.length > 0 && setShowSuggestions(true)}
            />

            {/* Address Suggestions Dropdown */}
            {showSuggestions && addressSuggestions.length > 0 && (
              <ListGroup
                className="position-absolute w-100 mt-1"
                style={{ zIndex: 1000, maxHeight: '300px', overflowY: 'auto' }}
              >
                {addressSuggestions.map((feature, idx) => (
                  <ListGroup.Item
                    key={idx}
                    action
                    onClick={() => selectAddress(feature)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div><strong>{feature.text}</strong></div>
                    <small className="text-muted">{feature.place_name}</small>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
        </Row>

        <Row className="my-2">
          <BaseInput
            className="col-12"
            label="STREET"
            name="street"
            // required
            placeholder="STREET"
            formik={form}
          />
          <BaseInput
            className="col-md-4 mt-3"
            label="CITY"
            name="city"
            required
            placeholder="CITY"
            formik={form}
          />
          <StateSelect
            className="col-md-4 mt-3"
            label="STATE"
            name="state"
            required
            placeholder="STATE"
            formik={form}
          />
          <div className="col-md-4 mt-3">
            <BaseInput
              label="ZIP_CODE"
              name="zip_code"
              placeholder="ZIP_CODE"
              formik={form}
            />
            {form.values.city && form.values.state && !form.values.zip_code && (
              <Button
                size="sm"
                variant="outline-secondary"
                className="mt-1"
                onClick={(e) => {
                  e.preventDefault();
                  autoLookupZipCode();
                }}
              >
                Auto-Fill Zip Code
              </Button>
            )}
          </div>
        </Row>
      </>
    </EntityForm>
    </>
  );
}
