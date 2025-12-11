# Save & Continue Later - Integration Example

This document shows how to integrate the "Save & Continue Later" functionality into form components.

## Overview

The save functionality has been implemented with the following components:
- `useSaveAndContinueLater` hook - Handles save logic
- `SaveAndContinueLaterButton` component - The save button UI
- `SaveSuccessModal` component - Success modal with resume link
- `FormActions` component - Updated to support save button

## Integration Steps

### Step 1: Import Required Components

```typescript
import { useSaveAndContinueLater } from '../../../../../hooks/use-save-and-continue-later';
import { SaveSuccessModal } from '../../save-success-modal';
import { FormActions } from '../../form-buttons';
```

### Step 2: Use the Hook in Your Component

```typescript
export function YourFormStep() {
  const { stepNext, stepBack, applicant } = useContext(JotformContext);

  // Add the save hook
  const {
    saveAndExit,
    isSaving,
    resumeUrl,
    showSuccessModal,
    closeSuccessModal,
  } = useSaveAndContinueLater();

  // Your existing form logic
  const form = useFormik({
    // ... your form configuration
  });

  return (
    <>
      <form onSubmit={form.handleSubmit}>
        {/* Your form fields */}

        <FormActions
          onNext={form.handleSubmit}
          onBack={stepBack}
          onSave={saveAndExit}  // ADD THIS
          showSaveButton={true}  // ADD THIS
          isSaving={isSaving}    // ADD THIS
        />
      </form>

      {/* Add the success modal */}
      <SaveSuccessModal
        isOpen={showSuccessModal}
        onClose={closeSuccessModal}
        resumeUrl={resumeUrl}
        email={applicant?.email || applicant?.phone}
      />
    </>
  );
}
```

## Complete Example: Names and Basic Info Step

Here's a complete example of integrating save functionality into a form step:

```typescript
import { useFormik } from 'formik';
import { useContext } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import JotformContext, { JotFormContextType } from '../../../../../context/jotform-context';
import { NamesAndBasicInfoDto } from '../../../../../models/jot-form/short-form/names-and-basic-info.dto';
import { FormActions } from '../../form-buttons';
import { useSaveAndContinueLater } from '../../../../../hooks/use-save-and-continue-later';
import { SaveSuccessModal } from '../../save-success-modal';

export function NamesAndBasicInfo() {
  const {
    state: { applicant },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  // Add save functionality
  const {
    saveAndExit,
    isSaving,
    resumeUrl,
    showSuccessModal,
    closeSuccessModal,
  } = useSaveAndContinueLater();

  const form = useFormik({
    initialValues: new NamesAndBasicInfoDto(applicant),
    validationSchema: NamesAndBasicInfoDto.yupSchema(),
    onSubmit: async (values) => {
      setApplicant({
        ...applicant,
        ...values,
      });
      stepNext();
    },
    onReset: () => {
      stepBack();
    },
  });

  return (
    <>
      <div className="form-container">
        <h2>Basic Information</h2>
        <p>Please provide your basic information</p>

        <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={form.values.first_name || ''}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  isInvalid={form.touched.first_name && !!form.errors.first_name}
                />
                <Form.Control.Feedback type="invalid">
                  {form.errors.first_name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={form.values.last_name || ''}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  isInvalid={form.touched.last_name && !!form.errors.last_name}
                />
                <Form.Control.Feedback type="invalid">
                  {form.errors.last_name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Add more form fields... */}

          <FormActions
            onNext={form.handleSubmit}
            onBack={form.handleReset}
            onSave={saveAndExit}
            showSaveButton={true}
            isSaving={isSaving}
            isSubmitting={form.isSubmitting}
            isValid={form.isValid}
          />
        </Form>
      </div>

      {/* Success Modal */}
      <SaveSuccessModal
        isOpen={showSuccessModal}
        onClose={closeSuccessModal}
        resumeUrl={resumeUrl}
        email={applicant?.email || applicant?.phone}
      />
    </>
  );
}
```

## Important Notes

### 1. Email Availability

For steps before email is collected (steps 0-2), the success modal will show the phone number instead:

```typescript
<SaveSuccessModal
  isOpen={showSuccessModal}
  onClose={closeSuccessModal}
  resumeUrl={resumeUrl}
  email={applicant?.email || applicant?.phone}  // Falls back to phone
/>
```

### 2. When Applicant is Created

The save functionality requires an applicant record with an ID. The applicant must be created after phone verification (step 2) for the save to work properly. If the applicant doesn't have an ID yet, the hook will show a warning toast.

### 3. Backend Requirements

The frontend changes are complete, but the backend needs to implement:

1. **Database Migration**: Add `last_completed_step` column to applicant table
   ```sql
   ALTER TABLE applicants ADD COLUMN last_completed_step INTEGER;
   ```

2. **API Endpoint**: `PUT /api/applicants/applicant-jotform/:id/save-draft?step=X`
   - Updates applicant data
   - Sets `last_completed_step = X`
   - Sets `form_status = 'IN_PROGRESS'`
   - Sends email with resume link
   - Returns updated ApplicantEntity

3. **Email Service**: Configure email service (SendGrid, AWS SES, etc.) to send resume link emails

### 4. Testing Checklist

- [ ] Save button appears on the form step
- [ ] Click save button shows loading state
- [ ] Success modal appears with resume URL
- [ ] Copy button works to copy resume URL
- [ ] Email is sent with resume link (when backend is ready)
- [ ] Resume link works in new browser session
- [ ] User is restored to correct step
- [ ] Form data persists correctly

## Components to Update

Apply this pattern to all form components:

### Short Form (Steps 0-9)
- `/components/forms/jotform/shortForm/splash-page/index.tsx`
- `/components/forms/jotform/shortForm/ats-jobs/index.tsx`
- `/components/forms/jotform/shortForm/phone-number/index.tsx`
- `/components/forms/jotform/shortForm/names-and-basic-info/index.tsx`
- `/components/forms/jotform/shortForm/cdl-experience/index.tsx`
- `/components/forms/jotform/shortForm/accident-violation/index.tsx`
- `/components/forms/jotform/shortForm/transmission-and-endorsement/index.tsx`
- `/components/forms/jotform/shortForm/dui-and-equipment/index.tsx`
- `/components/forms/jotform/shortForm/preference/index.tsx`
- `/components/forms/jotform/shortForm/continue-longform/index.tsx`

### Long Form (Steps 10-26)
- `/components/forms/jotform/longForm/driver-application/index.tsx`
- `/components/forms/jotform/longForm/background-info/index.tsx`
- `/components/forms/jotform/longForm/highest-level-education/index.tsx`
- `/components/forms/jotform/longForm/driving-experience/index.tsx`
- `/components/forms/jotform/longForm/driver-license/index.tsx`
- `/components/forms/jotform/longForm/medical-card/index.tsx`
- `/components/forms/jotform/longForm/emergency-contact/index.tsx`
- `/components/forms/jotform/longForm/employment-history/index.tsx`
- `/components/forms/jotform/longForm/past-employment-history/index.tsx`
- `/components/forms/jotform/longForm/worked-before/index.tsx`
- `/components/forms/jotform/longForm/accident-history/index.tsx`
- `/components/forms/jotform/longForm/violation-history/index.tsx`
- `/components/forms/jotform/longForm/past-suspension/index.tsx`
- `/components/forms/jotform/longForm/unable-for-job/index.tsx`
- `/components/forms/jotform/longForm/felony-conviction/index.tsx`
- `/components/forms/jotform/longForm/drug-test/index.tsx`
- `/components/forms/jotform/longForm/legal-documents-page/index.tsx`

## Summary

The "Save & Continue Later" feature is now ready for integration across all form steps. The frontend implementation is complete, and the pattern above can be replicated to all 28 form steps. The backend team needs to implement the `/save-draft` endpoint and email service for full functionality.
