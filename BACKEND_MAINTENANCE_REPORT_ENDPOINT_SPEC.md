# Backend API Endpoint Required: Vehicle Maintenance Reports

## Issue
The frontend is attempting to upload maintenance reports to the endpoint `POST /api/vehicles/:vehicleId/maintenance-reports`, but this endpoint returns a 404 error because it doesn't exist on the backend server.

## Required Backend Endpoints

The backend needs to implement the following endpoints to support vehicle maintenance report management:

### 1. List Maintenance Reports
- **Method**: GET
- **Path**: `/api/vehicles/:vehicleId/maintenance-reports`
- **Description**: Get all maintenance reports for a specific vehicle
- **Response**: Array of VehicleMaintenanceReportEntity objects

### 2. Get Maintenance Report by ID
- **Method**: GET
- **Path**: `/api/vehicles/:vehicleId/maintenance-reports/:id`
- **Description**: Get a specific maintenance report
- **Response**: VehicleMaintenanceReportEntity object

### 3. Create Maintenance Report ⚠️ MISSING - CAUSING 404 ERROR
- **Method**: POST
- **Path**: `/api/vehicles/:vehicleId/maintenance-reports`
- **Description**: Create a new maintenance report for a vehicle
- **Request Body**: VehicleMaintenanceReportEntity
- **Response**: Created VehicleMaintenanceReportEntity with ID

### 4. Update Maintenance Report
- **Method**: PUT
- **Path**: `/api/vehicles/:vehicleId/maintenance-reports/:id`
- **Description**: Update an existing maintenance report
- **Request Body**: VehicleMaintenanceReportEntity
- **Response**: Updated VehicleMaintenanceReportEntity

### 5. Delete Maintenance Report
- **Method**: DELETE
- **Path**: `/api/vehicles/:vehicleId/maintenance-reports/:id`
- **Description**: Delete a maintenance report
- **Response**: 204 No Content or success message

## Request Body Schema

### VehicleMaintenanceReportEntity

```typescript
{
  id?: number;                        // Auto-generated on create
  maintenance_date: Date;             // REQUIRED
  maintenance_type: MaintenanceType;  // REQUIRED - enum value
  description: string;                // REQUIRED - min 3 characters
  notes?: string;                     // Optional
  odometer_reading?: number;          // Optional - must be >= 0
  next_service_date?: Date;           // Optional
  next_service_odometer?: number;     // Optional - must be >= 0
  maintenance_document?: DocumentEntity; // Optional - file upload
  created_at?: Date;                  // Auto-generated
  updated_at?: Date;                  // Auto-generated
}
```

### MaintenanceType Enum Values
```typescript
enum MaintenanceType {
  OIL_CHANGE = 'Oil Change',
  TIRE_ROTATION = 'Tire Rotation',
  BRAKE_SERVICE = 'Brake Service',
  TRANSMISSION_SERVICE = 'Transmission Service',
  ENGINE_TUNE_UP = 'Engine Tune-Up',
  COOLANT_FLUSH = 'Coolant Flush',
  BATTERY_REPLACEMENT = 'Battery Replacement',
  AIR_FILTER = 'Air Filter',
  INSPECTION = 'Inspection',
  OTHER = 'Other',
}
```

## Validation Requirements

The backend should validate:

1. **Required Fields**:
   - `maintenance_date` - Must be a valid date
   - `maintenance_type` - Must be one of the MaintenanceType enum values
   - `description` - Must be at least 3 characters

2. **Optional Fields with Validation**:
   - `odometer_reading` - If provided, must be >= 0
   - `next_service_odometer` - If provided, must be >= 0
   - `maintenance_document` - If provided, must be a valid file (PDF or image, max 3MB)

3. **Error Response Format**:
   When validation fails, return a structured error response:
   ```json
   {
     "statusCode": 400,
     "message": [
       "maintenance_date is required",
       "maintenance_type must be a valid enum value",
       "description must be at least 3 characters"
     ],
     "error": "Bad Request"
   }
   ```

   This format allows the frontend's `globalAjaxExceptionHandler` to display specific field errors to the user.

## File Upload Handling

The `maintenance_document` field should:
- Accept PDF files and images (jpg, png, etc.)
- Have a maximum size limit of 3MB (3,145,728 bytes)
- Store files with DocumentType.MAINTENANCE
- Return the complete DocumentEntity in the response

## Reference Implementation

Similar patterns exist for:
- Vehicle Inspections: `/api/vehicles/:vehicleId/inspections`
- Vehicle Repair Records: `/api/vehicles/:vehicleId/repair-records`

Follow the same architectural pattern used for these endpoints.

## Testing the Endpoint

Once implemented, test with:
```bash
curl -X POST http://localhost:4000/api/vehicles/60/maintenance-reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "maintenance_date": "2024-01-15T00:00:00.000Z",
    "maintenance_type": "Oil Change",
    "description": "Regular oil change service",
    "odometer_reading": 50000
  }'
```

Expected response: 201 Created with the created entity including an ID.
