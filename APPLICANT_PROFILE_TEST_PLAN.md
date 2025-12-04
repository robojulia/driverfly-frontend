# Applicant Profile - Edit & Save Functionality Test Plan

**Test Date:** TBD
**Tester:** TBD
**Page:** `/dashboard/company/applicants/[id]/edit`
**Global Save Button:** Fixed position (top-right), consolidates all form changes into single API call

---

## Test Overview

This document provides a systematic test plan for verifying that all sections of the applicant profile can be edited and successfully saved. The page uses a global registry pattern where each form registers its getter function to provide current values when the "Update" button is clicked.

### Key Architecture Points:
- **Global Save Button**: Fixed at top-right, calls `handleSave()` in `edit.tsx:59`
- **Form Registry**: Each form registers at `window.__applicantFormRegistry[formId]`
- **Single API Call**: All changes consolidated into one PUT request to `/api/applicant/{id}`
- **Extras Merging**: Intelligent merging of `extras` array, with licensing form taking priority

---

## Test Sections

### 1. Basic Details Form
**Component:** `ApplicantBasicDetailsFormNew` (applicant-basic-details-form-new.tsx)
**Form ID:** Should register as `'basic-details'` or similar
**Location:** Top of page, `#basic-info`

#### Fields to Test:
- [ ] First Name
- [ ] Middle Name
- [ ] Last Name
- [ ] Email
- [ ] Phone Number
- [ ] Address Line 1
- [ ] Address Line 2
- [ ] City
- [ ] State
- [ ] Zip Code
- [ ] Date of Birth
- [ ] Social Security Number (if applicable)

#### Test Steps:
1. Open applicant profile edit page
2. Modify one or more fields in Basic Details section
3. Click "Update" button (top-right)
4. Verify success toast: "Applicant Updated Successfully"
5. Refresh page or navigate away and back
6. Verify changes persisted

**Status:** ⬜ Not Started | ⬜ In Progress | ⬜ Pass | ⬜ Fail
**Notes:**

---

### 2. Licensing Form (CDL Information)
**Component:** `ApplicantLicensingForm` (applicant-licensing-form.tsx)
**Form ID:** `'licensing'`
**Location:** `#licensing`

#### Fields to Test:
- [ ] CDL Number
- [ ] CDL State
- [ ] CDL Class
- [ ] CDL Expiration Date
- [ ] Endorsements (H, N, P, S, T, X, etc.)
- [ ] Restrictions
- [ ] DOT Number (stored in extras)
- [ ] Business Name (stored in extras)
- [ ] Medical Card Expiration
- [ ] Medical Card File Upload

#### Test Steps:
1. Modify licensing fields
2. Especially test DOT Number and Business Name (these are in `extras` array)
3. Click "Update" button
4. Verify success toast
5. Verify changes persisted (especially extras)

**Special Note:** This form processes LAST in extras merging (see edit.tsx:102-105)

**Status:** ⬜ Not Started | ⬜ In Progress | ⬜ Pass | ⬜ Fail
**Notes:**

---

### 3. Equipment Experience Form
**Component:** `ApplicantEquipmentExperienceForm` (applicant-equipment-experience-form.tsx)
**Form ID:** Check component for registration
**Location:** `#equipment`

#### Fields to Test:
- [ ] Equipment type selections (multiple entries possible)
- [ ] Years of experience for each equipment type
- [ ] Add new equipment experience
- [ ] Remove equipment experience
- [ ] Edit existing equipment experience

#### Test Steps:
1. Add a new equipment experience entry
2. Edit an existing entry
3. Delete an entry
4. Click "Update" button
5. Verify all changes (additions, edits, deletions) persisted

**Status:** ⬜ Not Started | ⬜ In Progress | ⬜ Pass | ⬜ Fail
**Notes:**

---

### 4. Equipment Owned Form
**Component:** `ApplicantEquipmentOwnForm` (applicant-equipment-own-form.tsx)
**Form ID:** Check component for registration
**Location:** `#equipment-owned`

#### Fields to Test:
- [ ] Owns truck (yes/no)
- [ ] Truck details (make, model, year, VIN)
- [ ] Owns trailer (yes/no)
- [ ] Trailer details
- [ ] Insurance information
- [ ] Registration information

#### Test Steps:
1. Toggle ownership checkboxes
2. Fill in equipment details
3. Click "Update" button
4. Verify changes persisted

**Status:** ⬜ Not Started | ⬜ In Progress | ⬜ Pass | ⬜ Fail
**Notes:**

---

### 5. Work History Form
**Component:** `ApplicantWorkHistoryForm` (applicant-work-history-form.tsx)
**Form ID:** Check component for registration
**Location:** `#work-history`

#### Fields to Test:
- [ ] Employer name
- [ ] Position/Title
- [ ] Start date
- [ ] End date
- [ ] Reason for leaving
- [ ] Contact information
- [ ] Add new employer
- [ ] Edit existing employer
- [ ] Delete employer

#### Test Steps:
1. Add a new work history entry
2. Edit existing entry
3. Delete an entry
4. Click "Update" button
5. Verify all changes persisted in `employers` array

**Status:** ⬜ Not Started | ⬜ In Progress | ⬜ Pass | ⬜ Fail
**Notes:**

---

### 6. Safety Background Form
**Component:** `ApplicantSafetyBackgroundForm` (applicant-safety-background-form.tsx)
**Form ID:** Check component for registration
**Location:** `#safety`

#### Fields to Test:
- [ ] Accident history entries
- [ ] Moving violation history entries
- [ ] DUI/DWI records
- [ ] License suspensions
- [ ] Safety scores/ratings
- [ ] Add/edit/delete accident records
- [ ] Add/edit/delete violation records

#### Test Steps:
1. Add new accident or violation
2. Edit existing records
3. Delete records
4. Click "Update" button
5. Verify changes in `accident_history` and `moving_violation_history` arrays

**Status:** ⬜ Not Started | ⬜ In Progress | ⬜ Pass | ⬜ Fail
**Notes:**

---

### 7. Already Worked Form
**Component:** `ApplicantAlreadyWorkedForm` (applicant-already-worked-form.tsx)
**Form ID:** Check component for registration
**Location:** `#already-worked`

#### Fields to Test:
- [ ] Previously worked at company (yes/no)
- [ ] Previous hire dates
- [ ] Reason for leaving
- [ ] Eligible for rehire
- [ ] Notes

#### Test Steps:
1. Toggle "previously worked" status
2. Fill in related fields
3. Click "Update" button
4. Verify changes persisted

**Status:** ⬜ Not Started | ⬜ In Progress | ⬜ Pass | ⬜ Fail
**Notes:**

---

### 8. Preferences Form
**Component:** `ApplicantPreferencesForm` (applicant-preferences-form.tsx)
**Form ID:** Check component for registration
**Location:** `#preferences`

#### Fields to Test:
- [ ] Preferred routes
- [ ] Home time preferences
- [ ] Pay rate expectations
- [ ] Job type preferences (OTR, Regional, Local)
- [ ] Equipment preferences
- [ ] Other preferences

#### Test Steps:
1. Modify preference fields
2. Click "Update" button
3. Verify changes persisted

**Status:** ⬜ Not Started | ⬜ In Progress | ⬜ Pass | ⬜ Fail
**Notes:**

---

### 9. Application Checklist Form
**Component:** `ApplicantApplicationChecklistForm` (applicant-application-checklist-form.tsx)
**Form ID:** Check component for registration
**Location:** `#application-checklist`

#### Fields to Test:
- [ ] Checklist item completions
- [ ] Checklist item notes
- [ ] Status toggles
- [ ] Required document uploads

#### Test Steps:
1. Toggle checklist items
2. Add notes to checklist items
3. Click "Update" button
4. Verify checklist state persisted

**Status:** ⬜ Not Started | ⬜ In Progress | ⬜ Pass | ⬜ Fail
**Notes:**

---

### 10. Notes Form
**Component:** `ApplicantNotesForm` (applicant-notes-form.tsx)
**Form ID:** Check component for registration
**Location:** `#notes`

#### Fields to Test:
- [ ] Internal notes field
- [ ] Note timestamps
- [ ] Add new notes
- [ ] Edit existing notes

#### Test Steps:
1. Add or modify notes
2. Click "Update" button
3. Verify notes persisted

**Note:** Notes might be handled differently as they appear in the excluded fields (edit.tsx:121)

**Status:** ⬜ Not Started | ⬜ In Progress | ⬜ Pass | ⬜ Fail
**Notes:**

---

### 11. Emergency Contact Form
**Component:** `ApplicantEmergencyContactForm` (applicant-emergency-contact-form.tsx)
**Form ID:** Check component for registration
**Location:** `#emergency-contact`

#### Fields to Test:
- [ ] Emergency contact name
- [ ] Relationship
- [ ] Phone number
- [ ] Email
- [ ] Address
- [ ] Alternate contact information

#### Test Steps:
1. Modify emergency contact fields
2. Click "Update" button
3. Verify changes persisted

**Status:** ⬜ Not Started | ⬜ In Progress | ⬜ Pass | ⬜ Fail
**Notes:**

---

## Integration Tests

### Global Save Functionality
- [ ] Modify fields in MULTIPLE sections simultaneously
- [ ] Click "Update" button once
- [ ] Verify ALL changes from all sections persisted
- [ ] Check browser console for proper registry logging
- [ ] Verify single PUT request in Network tab

### Form Registry Verification
Check that all forms register properly:
- [ ] Open browser console
- [ ] Type: `Object.keys(window.__applicantFormRegistry)`
- [ ] Verify all expected form IDs are present
- [ ] Document which forms are NOT registering (if any)

**Expected Form IDs:**
```
['basic-details', 'licensing', 'equipment-experience', 'equipment-owned',
 'work-history', 'safety', 'already-worked', 'preferences',
 'application-checklist', 'notes', 'emergency-contact']
```

### Extras Array Merging
Special test for the extras merging logic:
- [ ] Modify DOT Number in licensing form
- [ ] Modify other extras in different forms
- [ ] Click "Update" button
- [ ] Check console logs for extras merging
- [ ] Verify licensing form extras take priority
- [ ] Verify all unique extras types are preserved

---

## Error Scenarios

### Network Failures
- [ ] Disconnect network
- [ ] Make changes
- [ ] Click "Update" button
- [ ] Verify error toast displays
- [ ] Verify changes are NOT lost (still in form state)
- [ ] Reconnect and retry
- [ ] Verify changes save successfully

### Validation Errors
- [ ] Enter invalid data (e.g., invalid email, phone format)
- [ ] Click "Update" button
- [ ] Verify appropriate validation messages
- [ ] Verify form highlights invalid fields
- [ ] Verify data does NOT save

### Concurrent Editing
- [ ] Open same applicant in two browser tabs
- [ ] Make different changes in each tab
- [ ] Save from tab 1
- [ ] Save from tab 2
- [ ] Verify behavior (last save wins? conflict detection?)

---

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Performance Testing

- [ ] Make changes to ALL sections simultaneously
- [ ] Measure time from "Update" click to success toast
- [ ] Verify no UI freezing during save
- [ ] Check Network tab for payload size
- [ ] Verify single API call (not multiple)

---

## Regression Checks

After confirming all sections save properly:
- [ ] Test page refresh doesn't lose data
- [ ] Test navigation away and back preserves data
- [ ] Test browser back button behavior
- [ ] Test direct URL navigation to applicant
- [ ] Verify no console errors during any operations

---

## Known Issues / Technical Debt

Document any issues found during testing:

1. **Forms Not Registering:**
   - Form ID: ___________
   - Issue: ___________
   - File: ___________

2. **Save Failures:**
   - Section: ___________
   - Error: ___________
   - Payload: ___________

3. **UI/UX Issues:**
   - Description: ___________
   - Steps to reproduce: ___________

---

## Test Summary

**Total Sections:** 11
**Sections Passing:** ___
**Sections Failing:** ___
**Sections Skipped:** ___

**Overall Status:** ⬜ Pass | ⬜ Fail | ⬜ Needs Fixes

**Tester Sign-off:** ___________
**Date:** ___________

---

## Files to Review for Issues

If sections fail to save, check these files:

1. **Main Edit Page:** `pages/dashboard/company/applicants/[id]/edit.tsx:59` (handleSave)
2. **Form Container:** `components/forms/company/edit-applicant-form-new.tsx`
3. **Individual Form Components:**
   - `applicant-basic-details-form-new.tsx`
   - `applicant-licensing-form.tsx`
   - `applicant-equipment-experience-form.tsx`
   - `applicant-equipment-own-form.tsx`
   - `applicant-work-history-form.tsx`
   - `applicant-safety-background-form.tsx`
   - `applicant-already-worked-form.tsx`
   - `applicant-preferences-form.tsx`
   - `applicant-application-checklist-form.tsx`
   - `applicant-notes-form.tsx`
   - `applicant-emergency-contact-form.tsx`

4. **API Handler:** `pages/api/applicant.ts` (update method)

**Key Code Locations:**
- Form registry initialization: `edit-applicant-form-new.tsx:38-41`
- Global save logic: `edit.tsx:59-154`
- Extras merging: `edit.tsx:87-117`
- API call: `edit.tsx:136-137`
