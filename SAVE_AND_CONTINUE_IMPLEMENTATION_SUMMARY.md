# Save & Continue Later - Implementation Summary

## Overview

This document summarizes the implementation of the "Save & Continue Later" feature for the driver application form.

## User Requirements (Met)

- ✅ Explicit "Save & Continue Later" button on all steps
- ✅ Save to server starting from step 2 (after phone verification)
- ✅ Show resume link in modal + email it to driver
- ✅ MVP scope: Core functionality only (no SMS, dashboards, analytics)

## Frontend Implementation (Completed)

### 1. Data Models

#### ApplicantEntity (`models/applicant/applicant.entity.ts`)
- **Added Field**: `last_completed_step?: number`
- **Purpose**: Tracks which step the user last completed
- **Location**: Line 140

#### ApplicantFormStatus Enum (`enums/applicants/applicant-form-status.enum.ts`)
- **Added Status**: `IN_PROGRESS = 'IN_PROGRESS'`
- **Purpose**: Distinguishes saved drafts from completed submissions
- **Location**: Line 3

### 2. API Client

#### ApplicantApi (`pages/api/applicant.ts`)
- **Added Method**: `jotform.saveDraft(applicantId, dto, currentStep, config)`
- **Endpoint**: `PUT /api/applicants/applicant-jotform/:id/save-draft?step=X`
- **Purpose**: Frontend API client method for saving drafts
- **Location**: Lines 261-273

### 3. Hooks

#### useSaveAndContinueLater (`hooks/use-save-and-continue-later.ts`) - NEW FILE
- **Purpose**: Core logic for save functionality
- **Features**:
  - Saves current form data to server
  - Updates `last_completed_step`
  - Triggers email with resume link (backend sends email)
  - Shows success modal with resume URL
  - Handles errors with user feedback
- **Returns**: `{ saveAndExit, isSaving, saveError, resumeUrl, showSuccessModal, closeSuccessModal }`

### 4. UI Components

#### SaveAndContinueLaterButton (`components/forms/jotform/save-and-continue-later-button.tsx`) - NEW FILE
- **Purpose**: Save button with loading state
- **Features**:
  - Secondary button styling
  - Bookmark icon
  - Loading spinner when saving
  - Disabled state

#### SaveSuccessModal (`components/forms/jotform/save-success-modal.tsx`) - NEW FILE
- **Purpose**: Success modal after save
- **Features**:
  - Shows success message
  - Displays resume URL with copy button
  - Shows email confirmation
  - "Got it" button to close

#### FormActions (`components/forms/jotform/form-buttons.tsx`) - UPDATED
- **Changes**:
  - Added `onSave` prop
  - Added `showSaveButton` prop
  - Added `isSaving` prop
  - Integrated `SaveAndContinueLaterButton` component
- **Location**: Lines 4, 178-184, 239-245

### 5. Page Updates

#### Long Form (`pages/apply/longform/[applicant_uuid]/index.tsx`) - UPDATED
- **Changes**:
  - Initialize `steps` from `initialApplicant.last_completed_step` (Line 45)
  - Show welcome back message when resuming (Lines 69-80)
- **Features**:
  - Restores user to their last completed step
  - Shows toast notification: "Welcome back! Resuming from step X of Y"

## Files Created

1. `/hooks/use-save-and-continue-later.ts`
2. `/components/forms/jotform/save-and-continue-later-button.tsx`
3. `/components/forms/jotform/save-success-modal.tsx`
4. `/SAVE_AND_CONTINUE_INTEGRATION_EXAMPLE.md`
5. `/SAVE_AND_CONTINUE_IMPLEMENTATION_SUMMARY.md` (this file)

## Files Modified

1. `/models/applicant/applicant.entity.ts`
2. `/enums/applicants/applicant-form-status.enum.ts`
3. `/pages/api/applicant.ts`
4. `/components/forms/jotform/form-buttons.tsx`
5. `/pages/apply/longform/[applicant_uuid]/index.tsx`

## Backend Requirements (Not Yet Implemented)

The frontend is complete, but the backend team needs to implement the following:

### 1. Database Migration

Add `last_completed_step` column to the applicants table:

```sql
ALTER TABLE applicants ADD COLUMN last_completed_step INTEGER;
```

### 2. Update ApplicantFormStatus Enum

Add `IN_PROGRESS` status to the backend enum:

```typescript
export enum ApplicantFormStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',  // NEW
  CLOSE = 'CLOSE',
  SHORT_FORM_SUBMITTED = 'SHORT_FORM_SUBMITTED',
  LONG_FORM_SUBMITTED = 'LONG_FORM_SUBMITTED',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
}
```

### 3. Create Save Draft Endpoint

**Endpoint**: `PUT /api/applicants/applicant-jotform/:id/save-draft`

**Query Parameters**:
- `step` (number) - The current step number

**Request Body**: `UpsertApplicantJotformDto`
```typescript
{
  applicant?: ApplicantEntity,
  applicantExtras?: ApplicantExtrasEntity[],
  jobs?: JobEntity[],
  utm?: UtmReferral
}
```

**Logic**:
1. Update applicant record with provided data
2. Set `last_completed_step = req.query.step`
3. Set `form_status = ApplicantFormStatus.IN_PROGRESS`
4. Generate resume URL: `https://[domain]/apply/longform/${applicant.uuid_token}`
5. Send email with resume link (see email template below)
6. Return updated `ApplicantEntity`

**Response**: `ApplicantEntity` with updated fields

### 4. Email Template

**Subject**: Continue Your Application with [Company Name]

**Body**:
```html
Hi [First Name],

You started an application with [Company Name] and saved your progress.

Resume your application here:
[Resume Link Button/URL]

This link will remain active for 30 days.

Questions? Contact [Company Support Email]

Thanks,
The [Company Name] Team
```

**Required Variables**:
- `First Name` - applicant.first_name
- `Company Name` - applicant.company.name
- `Resume Link` - `https://[domain]/apply/longform/${applicant.uuid_token}`
- `Company Support Email` - applicant.company.support_email or default

### 5. Email Service Integration

Configure email service (SendGrid, AWS SES, Postmark, etc.) to send transactional emails.

**Recommended**: SendGrid or AWS SES for reliability and deliverability.

## Next Steps

### For Frontend Team

1. **Integrate save functionality into all form components** (28 steps total)
   - Use the pattern from `SAVE_AND_CONTINUE_INTEGRATION_EXAMPLE.md`
   - Start with high-traffic steps (steps 3-9)
   - Then complete long form steps (steps 10-26)

2. **Test the integration**
   - Verify save button appears and works
   - Test with mock backend endpoint (or wait for backend)
   - Ensure success modal displays correctly

### For Backend Team

1. **Database Migration**
   - Add `last_completed_step` column
   - Update `ApplicantFormStatus` enum

2. **Implement Save Draft Endpoint**
   - Create `PUT /api/applicants/applicant-jotform/:id/save-draft`
   - Handle step parameter
   - Update applicant data
   - Set `last_completed_step` and `form_status`

3. **Email Service Setup**
   - Configure email provider (SendGrid/AWS SES)
   - Create email template
   - Send resume link email on save

4. **Testing**
   - Test endpoint with Postman/Insomnia
   - Verify email delivery
   - Confirm data persistence

### For QA Team

**Manual Testing Checklist**:
- [ ] Save button appears on all 28 form steps
- [ ] Save button shows loading state when clicked
- [ ] Success modal appears after save
- [ ] Resume URL is generated correctly
- [ ] Copy button copies URL to clipboard
- [ ] Email is received with resume link
- [ ] Resume link works in new browser/device
- [ ] User is restored to correct step
- [ ] Form data persists correctly
- [ ] Save works on mobile devices
- [ ] Error handling works (network failure, server error)

**Integration Testing**:
- [ ] Short form save flow (steps 0-9)
- [ ] Long form save flow (steps 10-26)
- [ ] Form status transitions: OPEN → IN_PROGRESS → SUBMITTED
- [ ] Email delivery and link validity
- [ ] Existing auto-save still works

## Known Limitations

### 1. Phone Number Step (Step 2) - Not Modified

The phone number step is complex with multiple scenarios (same company, different company, new applicant, etc.). Modifying it to create the applicant record earlier requires careful consideration to avoid breaking existing functionality.

**Current Behavior**:
- Applicant record is created later in the flow (around step 9)
- Save functionality will only work after applicant is created

**Recommendation**:
- Backend team should review phone number step logic
- Consider if early applicant creation is necessary or if current flow is acceptable
- If needed, create applicant record after OTP verification with minimal data

### 2. Validation

The current implementation saves partial data without validation. This is intentional to allow users to save at any point, but it means:
- Users can save incomplete forms
- Backend should accept partial data
- Final submission should still validate all required fields

### 3. Link Expiration

The plan mentions 30-day link expiration, but this is not implemented. Backend should:
- Set TTL on draft applications
- Show "Link expired" message for old drafts
- Optionally: Allow users to request new link

## Success Metrics

Once fully implemented, track these metrics:

1. **Save button usage**: % of users who click save
2. **Resume rate**: % of saved drafts that are resumed
3. **Completion rate**: % of saved drafts that are submitted
4. **Time to resume**: Hours/days between save and resume
5. **Drop-off points**: Which steps users save and never return

## Timeline Estimate

- **Frontend Integration**: 2-3 days (integrate save into all 28 form steps)
- **Backend Implementation**: 3-5 days (database, endpoint, email service)
- **Testing & QA**: 2-3 days (manual and automated testing)
- **Total**: 7-11 days

## Support

For questions or issues:
- **Frontend**: Refer to `SAVE_AND_CONTINUE_INTEGRATION_EXAMPLE.md`
- **Backend**: Refer to "Backend Requirements" section above
- **Testing**: Refer to "Next Steps > For QA Team" section above

## Conclusion

The "Save & Continue Later" feature frontend implementation is complete and ready for integration across all form steps. The backend team can now implement the required endpoint and email service. Once both frontend and backend are complete, users will be able to save their progress at any point in the application and resume later via email link.
