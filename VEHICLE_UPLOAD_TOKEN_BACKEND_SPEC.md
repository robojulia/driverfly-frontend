# Vehicle Upload Token - Backend API Specification

## Overview

This specification outlines the backend API endpoints needed to support the vehicle document upload token system. This system allows drivers to upload vehicle documents (safety inspections, maintenance reports, etc.) via a secure, time-limited link without requiring authentication or account creation.

## Database Schema

### Table: `vehicle_upload_tokens`

```sql
CREATE TABLE vehicle_upload_tokens (
  id SERIAL PRIMARY KEY,
  token VARCHAR(255) UNIQUE NOT NULL,  -- Secure random token (e.g., UUID v4)
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,  -- 'SAFETY_INSPECTION', 'MAINTENANCE_REPORT', 'OTHER'
  driver_name VARCHAR(255),
  driver_email VARCHAR(255),
  driver_phone VARCHAR(50),
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_token (token),
  INDEX idx_vehicle_id (vehicle_id),
  INDEX idx_expires_at (expires_at),
  INDEX idx_is_active (is_active)
);
```

### Relationships
- Each token is associated with one vehicle
- Documents uploaded via a token should be linked to both the vehicle and the token
- Consider adding a `token_id` field to your existing document/file upload tables to track which documents were uploaded via tokens

## API Endpoints

### 1. Generate Upload Token (Authenticated)

**Endpoint:** `POST /api/vehicle-upload-tokens`

**Authentication:** Required (JWT Bearer token)

**Request Body:**
```json
{
  "vehicle_id": 123,
  "document_type": "SAFETY_INSPECTION",
  "driver_name": "John Doe",
  "driver_email": "john.doe@email.com",
  "driver_phone": "+1234567890"
}
```

**Response:** `201 Created`
```json
{
  "id": 456,
  "token": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "vehicle_id": 123,
  "document_type": "SAFETY_INSPECTION",
  "driver_name": "John Doe",
  "driver_email": "john.doe@email.com",
  "driver_phone": "+1234567890",
  "expires_at": "2025-12-26T10:30:00Z",
  "is_active": true,
  "created_at": "2025-11-26T10:30:00Z"
}
```

**Business Logic:**
- Generate a cryptographically secure random token (UUID v4 recommended)
- Set `expires_at` to 30 days from creation (configurable)
- Set `is_active` to `true`
- Return the complete token entity

**Validation:**
- `vehicle_id` must exist and belong to the authenticated user's company
- `document_type` must be one of: `SAFETY_INSPECTION`, `MAINTENANCE_REPORT`, `OTHER`
- Email format validation if provided
- Phone format validation if provided

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Vehicle doesn't belong to user's company
- `404 Not Found` - Vehicle not found

---

### 2. Validate Token (Public - No Authentication)

**Endpoint:** `GET /api/vehicle-upload-tokens/validate/:token`

**Authentication:** Not Required (Public endpoint)

**Response:** `200 OK`
```json
{
  "id": 456,
  "token": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "vehicle_id": 123,
  "vehicle": {
    "id": 123,
    "make": "Ford",
    "model": "F-150",
    "year": 2022,
    "unit_number": "TRUCK-001"
  },
  "document_type": "SAFETY_INSPECTION",
  "driver_name": "John Doe",
  "driver_email": "john.doe@email.com",
  "driver_phone": "+1234567890",
  "expires_at": "2025-12-26T10:30:00Z",
  "is_active": true,
  "created_at": "2025-11-26T10:30:00Z"
}
```

**Business Logic:**
- Look up token in database
- Check if token is active (`is_active = true`)
- Check if token has not expired (`expires_at > NOW()`)
- Check if token has not been used (`used_at IS NULL`) - OR allow multiple uses if preferred
- Include basic vehicle information in response
- DO NOT require authentication

**Error Responses:**
- `404 Not Found` - Token doesn't exist, is inactive, expired, or already used

---

### 3. Upload Documents with Token (Public - No Authentication)

**Endpoint:** `POST /api/vehicle-upload-tokens/:token/upload`

**Authentication:** Not Required (Public endpoint)

**Request:** `multipart/form-data`
```
files: [File, File, ...] (multiple files supported)
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Documents uploaded successfully",
  "uploaded_files": [
    {
      "id": 789,
      "filename": "safety_inspection_2025.pdf",
      "mime_type": "application/pdf",
      "size": 1024000,
      "path": "https://s3.amazonaws.com/bucket/path/to/file.pdf"
    }
  ],
  "token_status": {
    "is_active": false,
    "used_at": "2025-11-26T11:45:00Z"
  }
}
```

**Business Logic:**
1. Validate token (same validation as endpoint #2)
2. Accept uploaded files (PDF, JPG, PNG formats)
3. Validate file size (max 10MB per file recommended)
4. Store files in your document storage system
5. Link uploaded documents to:
   - The vehicle (`vehicle_id`)
   - The document type from the token
   - The token itself (for audit trail)
6. **OPTIONAL:** Mark token as used by setting `used_at = NOW()` and/or `is_active = false`
   - If you want to allow multiple uploads with the same token (until expiration), skip this step
7. Send notification to fleet manager/admins that documents were uploaded
8. Return success response with uploaded file metadata

**File Validation:**
- Accepted MIME types: `application/pdf`, `image/jpeg`, `image/png`
- Max file size: 10MB per file
- Max files per upload: 10 files

**Error Responses:**
- `400 Bad Request` - Invalid file format, file too large, or no files provided
- `404 Not Found` - Token doesn't exist, is inactive, expired, or already used
- `413 Payload Too Large` - Files exceed size limit
- `500 Internal Server Error` - File storage failed

---

### 4. Get Tokens by Vehicle (Authenticated)

**Endpoint:** `GET /api/vehicle-upload-tokens?vehicle_id=123`

**Authentication:** Required (JWT Bearer token)

**Query Parameters:**
- `vehicle_id` (required): Filter tokens by vehicle ID

**Response:** `200 OK`
```json
[
  {
    "id": 456,
    "token": "a1b2c3d4-****-****-****-****567890",  // Masked for security
    "vehicle_id": 123,
    "document_type": "SAFETY_INSPECTION",
    "driver_name": "John Doe",
    "driver_email": "john.doe@email.com",
    "expires_at": "2025-12-26T10:30:00Z",
    "used_at": null,
    "is_active": true,
    "created_at": "2025-11-26T10:30:00Z",
    "uploaded_documents_count": 0
  }
]
```

**Business Logic:**
- Return all tokens for the specified vehicle
- Verify the vehicle belongs to the authenticated user's company
- Mask the token value (show first 8 and last 6 characters)
- Include count of documents uploaded with each token

**Error Responses:**
- `400 Bad Request` - Missing vehicle_id parameter
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Vehicle doesn't belong to user's company

---

### 5. Revoke Token (Authenticated)

**Endpoint:** `DELETE /api/vehicle-upload-tokens/:id`

**Authentication:** Required (JWT Bearer token)

**Response:** `204 No Content`

**Business Logic:**
- Set `is_active = false` for the token
- Verify the token's vehicle belongs to the authenticated user's company

**Error Responses:**
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Token's vehicle doesn't belong to user's company
- `404 Not Found` - Token not found

---

## Security Considerations

1. **Token Generation:**
   - Use cryptographically secure random token generation (UUID v4 or similar)
   - Tokens should be at least 32 characters long
   - Tokens should be unpredictable

2. **Rate Limiting:**
   - Implement rate limiting on public endpoints to prevent abuse
   - Suggestion: Max 10 validation attempts per IP per minute
   - Suggestion: Max 5 upload attempts per token per hour

3. **File Validation:**
   - Validate MIME types server-side (don't trust client)
   - Scan uploaded files for malware if possible
   - Store files in isolated storage (S3, etc.) with virus scanning

4. **CORS:**
   - Configure CORS appropriately for public endpoints
   - Allow origins from your frontend domain

5. **Expiration:**
   - Automatically cleanup expired tokens via cron job
   - Consider archiving instead of deleting for audit purposes

6. **Notifications:**
   - Send email/SMS to fleet manager when documents are uploaded
   - Include who uploaded (driver name/email) and what was uploaded

---

## Integration with Existing Notification System

When sending vehicle document reminder notifications (email/SMS), include the upload link:

```javascript
// Example integration in your notification service
const uploadLink = `${FRONTEND_URL}/upload/vehicle-document/${token}`;

const emailBody = `
Hi ${driverName},

This is a reminder that the safety inspection is due for ${vehicleInfo}.

Upload your documentation here (no login required):
${uploadLink}

This link expires in 30 days.

Thank you!
`;
```

---

## Cron Jobs / Background Tasks

### 1. Cleanup Expired Tokens
**Frequency:** Daily

**Action:**
```sql
UPDATE vehicle_upload_tokens
SET is_active = false
WHERE expires_at < NOW()
AND is_active = true;
```

### 2. Reminder Notifications
**Frequency:** Based on notification settings

**Action:**
- Query vehicles with upcoming/overdue inspections
- Generate upload tokens for each vehicle
- Send email/SMS with upload link to assigned driver

---

## Testing Checklist

- [ ] Can generate token successfully
- [ ] Can validate active token
- [ ] Cannot validate expired token
- [ ] Cannot validate used token (if single-use)
- [ ] Cannot validate revoked token
- [ ] Can upload documents with valid token
- [ ] Cannot upload documents with invalid token
- [ ] File size validation works
- [ ] File type validation works
- [ ] Documents are linked to vehicle correctly
- [ ] Notifications sent when documents uploaded
- [ ] Rate limiting prevents abuse
- [ ] CORS configured correctly for public endpoints
- [ ] Token cleanup cron job works

---

## Frontend Files Created

The following frontend files have been created and reference these API endpoints:

1. **Model:** `/models/company/vehicle-upload-token.entity.ts`
2. **API Client:** `/pages/api/vehicle-upload-token.ts`
3. **Upload Page:** `/pages/upload/vehicle-document/[token].tsx`
4. **Utilities:** `/utils/vehicle-upload-link.ts`

---

## Questions / Decisions Needed

1. **Single-use vs Multi-use tokens:**
   - Should a token be invalidated after first upload? Or allow multiple uploads until expiration?
   - **Recommendation:** Allow multiple uploads until expiration (more user-friendly)

2. **Document categorization:**
   - How should uploaded documents be categorized/tagged in the system?
   - **Recommendation:** Tag with document_type from token + link to vehicle

3. **Storage location:**
   - Where should uploaded documents be stored? (S3, local filesystem, etc.)
   - **Recommendation:** Use existing document storage system

4. **Notification recipients:**
   - Who should be notified when documents are uploaded via token?
   - **Recommendation:** Fleet managers + any configured notification recipients for that vehicle
