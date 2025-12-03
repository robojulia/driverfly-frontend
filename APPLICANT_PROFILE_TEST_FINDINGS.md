# Applicant Profile - Form Registration Analysis

**Analysis Date:** 2025-12-02
**Analyzed By:** Claude Code
**Purpose:** Identify which forms register with global save and which handle their own persistence

---

## Architecture Overview

The applicant profile edit page uses a **dual-save architecture**:

1. **Global Save Registry**: Forms register a getter function at `window.__applicantFormRegistry[formId]`
   - Consolidated into single PUT request when clicking "Update" button (top-right)
   - Located in: `pages/dashboard/company/applicants/[id]/edit.tsx:59-154`

2. **Individual Form Saves**: Some forms handle their own API calls directly
   - These forms save immediately when actions are taken
   - Do NOT participate in the global save registry

---

## Forms Registered with Global Save

These forms **DO** register with `__applicantFormRegistry` and participate in the global Update button:

### ✅ 1. Basic Details Form
- **File:** `applicant-basic-details-form-new.tsx`
- **Form ID:** `'basic-details'` (likely)
- **Data Saved:** Personal info, contact details, address, DOB, SSN

### ✅ 2. Licensing Form
- **File:** `applicant-licensing-form.tsx`
- **Form ID:** `'licensing'`
- **Data Saved:** CDL info, endorsements, restrictions, DOT number, business name
- **Special:** Processes LAST in extras merging (has priority for DOT_NUMBER and BUSINESS_NAME)

### ✅ 3. Equipment Experience Form
- **File:** `applicant-equipment-experience-form.tsx`
- **Form ID:** TBD (check component)
- **Data Saved:** `equipment_experience` array

### ✅ 4. Equipment Owned Form
- **File:** `applicant-equipment-own-form.tsx`
- **Form ID:** TBD (check component)
- **Data Saved:** `equipment_owned` array

### ✅ 5. Work History Form
- **File:** `applicant-work-history-form.tsx`
- **Form ID:** TBD (check component)
- **Data Saved:** `employers` array (previous employment)

### ✅ 6. Safety Background Form
- **File:** `applicant-safety-background-form.tsx`
- **Form ID:** TBD (check component)
- **Data Saved:** `accident_history` and `moving_violation_history` arrays

### ✅ 7. Already Worked Form
- **File:** `applicant-already-worked-form.tsx`
- **Form ID:** TBD (check component)
- **Data Saved:** Previous work at company, rehire eligibility

### ✅ 8. Preferences Form
- **File:** `applicant-preferences-form.tsx`
- **Form ID:** TBD (check component)
- **Data Saved:** Job preferences, route preferences, home time needs

### ✅ 9. Emergency Contact Form
- **File:** `applicant-emergency-contact-form.tsx`
- **Form ID:** TBD (check component)
- **Data Saved:** Emergency contact information

---

## Forms with Direct API Calls (NOT in Global Registry)

These forms **DO NOT** register with global save - they handle persistence independently:

### ⚠️ 10. Notes Form
- **File:** `applicant-notes-form.tsx`
- **Registration:** ❌ NOT in `__applicantFormRegistry`
- **Save Method:** Direct API calls to `applicantApi.notes.*`
- **Behavior:**
  - `handleAddNote()` → `applicantApi.notes.create()` (line 46)
  - `handleSaveEdit()` → `applicantApi.notes.update()` (line 77)
  - `handleDeleteNote()` → `applicantApi.notes.remove()` (line 115)
- **When Saved:** Immediately when user clicks "Log Note", "Save Changes", or "Delete"
- **Toast Notifications:** Individual success/error messages per action
- **Why Excluded:** Notes are explicitly excluded from global save payload (see `edit.tsx:121`)

### ⚠️ 11. Application Checklist Form
- **File:** `applicant-application-checklist-form.tsx`
- **Registration:** ❌ NOT in `__applicantFormRegistry`
- **Save Method:** Direct API calls to `applicantApi.dac.*`
- **Behavior:**
  - `handleCheckboxToggle()` → Creates or updates DAC items (line 57-86)
  - Each checkbox toggle triggers immediate save
  - `applicantApi.dac.create()` or `applicantApi.dac.update()`
- **When Saved:** Immediately when user toggles checkbox
- **Toast Notifications:** "Successfully updated checklist"
- **Why Excluded:** DAC items are relationship data, excluded from main payload (see `edit.tsx:121`)

---

## Special Components (Read-Only Display)

### 📄 Jobs Applied To
- **Component:** `ApplicantJobsAppliedTo`
- **File:** `components/applicants/applicant-jobs-applied-to`
- **Behavior:** Display only, no editing
- **Not testable for save functionality**

### 📄 Onboarding Documents
- **Component:** `OnboardingChecklist`
- **File:** `components/applicants/onboarding-checklist/index.tsx`
- **Behavior:** Document upload/management system
- **Separate persistence mechanism**
- **Not part of applicant update flow**

---

## Testing Implications

### Forms to Test with Global "Update" Button:
Test these **9 forms** by making changes and clicking the "Update" button:
1. Basic Details
2. Licensing
3. Equipment Experience
4. Equipment Owned
5. Work History
6. Safety Background
7. Already Worked
8. Preferences
9. Emergency Contact

**Expected Behavior:**
- Changes are collected via registry getters
- Consolidated into single payload
- Single PUT request to `/api/applicant/{id}`
- Success toast: "Applicant Updated Successfully"
- Page refetches data

### Forms to Test Independently:
Test these **2 forms** with their own save actions:
1. **Notes Form:**
   - Add note → Click "Log Note" → Verify immediate save
   - Edit note → Click "Save Changes" → Verify update
   - Delete note → Confirm → Verify removal

2. **Application Checklist Form:**
   - Toggle checkbox → Verify immediate save
   - Check "Successfully updated checklist" toast
   - Refresh page → Verify state persisted

---

## Excluded from Global Save Payload

The following fields are explicitly stripped before sending to API (`edit.tsx:120-123`):
- `jobs` - Relationship, managed elsewhere
- `documents` - Relationship, managed via OnboardingChecklist
- `notes` - Relationship, managed via NotesForm direct API calls
- `dac` - Relationship, managed via ApplicationChecklistForm direct API calls
- `voeData` - Verification data, not editable

These fields are **included** in payload (`edit.tsx:126-133`):
- `employers` ✅
- `extras` ✅
- `accident_history` ✅
- `moving_violation_history` ✅
- `equipment_experience` ✅
- `equipment_owned` ✅
- `vehicles` ✅
- `meta` ✅

---

## Recommended Testing Workflow

### Phase 1: Individual Form Testing
Test each of the 9 registered forms individually:
1. Make change in one form only
2. Click "Update" button
3. Verify success toast
4. Refresh page
5. Confirm persistence

### Phase 2: Multi-Form Testing
Test global save with multiple simultaneous changes:
1. Modify Basic Details
2. Modify Licensing
3. Modify Work History
4. Click "Update" once
5. Verify all 3 changes persisted

### Phase 3: Independent Save Testing
Test Notes and Application Checklist:
1. Add/edit/delete notes → Verify immediate saves
2. Toggle checklist items → Verify immediate saves
3. Ensure these work WITHOUT clicking "Update" button

### Phase 4: Combined Testing
1. Make changes to registered forms (Basic Details, Licensing, etc.)
2. Add a note
3. Toggle checklist item
4. Click "Update" button
5. Verify:
   - Registered forms saved via global save
   - Note saved independently (already persisted)
   - Checklist saved independently (already persisted)
   - No conflicts or data loss

---

## Browser Console Verification

To verify which forms are registered, open browser console and run:

```javascript
// Check which forms are registered
Object.keys(window.__applicantFormRegistry)

// Expected output (9 forms):
// ['basic-details', 'licensing', 'equipment-experience', 'equipment-owned',
//  'work-history', 'safety', 'already-worked', 'preferences', 'emergency-contact']

// NOT expected: 'notes', 'application-checklist' (these use direct API calls)
```

To see what data a specific form will return:

```javascript
// Get current form values for licensing
window.__applicantFormRegistry['licensing']()

// Check extras merging
const registry = window.__applicantFormRegistry;
const allValues = {};
Object.keys(registry).forEach(formId => {
  const values = registry[formId]();
  console.log(formId, values);
});
```

---

## Critical Test Scenarios

### Scenario 1: Extras Merging
**Test:** Verify DOT Number from licensing form takes priority
1. Set DOT Number in licensing form to "12345"
2. Modify another field in a different form
3. Click "Update"
4. Check browser console logs for extras merging
5. Verify final payload has DOT_NUMBER = "12345"
6. Verify licensing form processed last (console shows "Processing extras from licensing")

### Scenario 2: Notes Don't Interfere with Global Save
**Test:** Verify notes save independently
1. Make changes to Basic Details (don't save yet)
2. Add a new note → Click "Log Note"
3. Verify note saves immediately with success toast
4. Click "Update" button
5. Verify Basic Details changes saved
6. Verify note still persisted

### Scenario 3: Checklist Doesn't Interfere with Global Save
**Test:** Verify checklist saves independently
1. Make changes to Preferences form (don't save yet)
2. Toggle a checklist item
3. Verify checklist saves immediately with success toast
4. Click "Update" button
5. Verify Preferences changes saved
6. Verify checklist state still persisted

---

## Known Architecture Considerations

1. **Registry Pattern**: Forms must call registration cleanup on unmount
   - Check for `useEffect` return functions that unregister

2. **Extras Merging**: Complex logic for handling `extras` array
   - Licensing form intentionally processes last
   - DOT_NUMBER and BUSINESS_NAME filtered from entity extras first
   - Then merged from all forms, with licensing winning

3. **Payload Construction**: Manual field selection vs exclusion
   - Some fields explicitly excluded
   - Some arrays explicitly included
   - Rest passed through

4. **Refetch After Save**: Page triggers `setRefetchApplicant` after success
   - Ensures UI shows latest data from database
   - Prevents stale state issues

---

## Summary

✅ **9 forms** use global save registry → Test with "Update" button
⚠️ **2 forms** use direct API calls → Test with their own action buttons
📄 **2 components** are display-only → No save testing needed

**Total Sections to Test:** 11 (9 global + 2 independent)

**Testing Priority:**
1. HIGH: Global save with single form changes
2. HIGH: Global save with multi-form changes
3. MEDIUM: Independent saves (notes, checklist)
4. MEDIUM: Combined global + independent saves
5. LOW: Edge cases (network failures, validation errors)
