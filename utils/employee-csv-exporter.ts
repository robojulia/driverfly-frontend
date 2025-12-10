import Papa from 'papaparse';
import { EmployeeEntity } from '../models/employee/employee.entity';

export class EmployeeCSVExporter {
  static flattenEmployeeForCSV(employee: EmployeeEntity): Record<string, any> {
    const flatData: Record<string, any> = {
      // Core Identity
      'ID': employee.id || '',
      'First Name': employee.first_name || '',
      'Last Name': employee.last_name || '',
      'Email': employee.email || '',
      'Phone': employee.phone || '',
      'Birthdate': employee.birthdate || '',

      // Address
      'Address Line 1': employee.address_1 || '',
      'Address Line 2': employee.address_2 || '',
      'Street': employee.street || '',
      'City': employee.city || '',
      'State': employee.state || '',
      'Zip Code': employee.zip_code || '',

      // Employment Status
      'Status': employee.status || '',
      'Status Other': employee.status_other || '',
      'Hire Date': employee.hire_date || '',
      'Termination Date': employee.termination_date || '',
      'Reason Codes': Array.isArray(employee.reason_codes)
        ? employee.reason_codes.join(', ')
        : '',
      'Reason Codes Other': employee.reason_codes_other || '',

      // Job & Management
      'Job Title': employee.job?.title || '',
      'Manager Name': employee.manager?.name || '',
      'Manager Email': employee.manager?.email || '',

      // Licensing Information
      'License Number': employee.license_number || '',
      'License State': employee.license_state || '',
      'License Type': employee.license_type || '',
      'License Expiry': employee.license_expiry || '',
      'Years CDL Experience': employee.years_cdl_experience || '',
      'Endorsements': Array.isArray(employee.endorsements)
        ? employee.endorsements.join(', ')
        : '',
      'Transmission Type': Array.isArray(employee.transmission_type)
        ? employee.transmission_type.join(', ')
        : '',

      // Education
      'Highest Degree': employee.highest_degree || '',

      // Work Authorization
      'Authorized to Work in US': employee.authorized_to_work_in_us ? 'Yes' : 'No',

      // Testing & Preferences
      'Can Pass Drug Test': employee.can_pass_drug_test ? 'Yes' : 'No',
      'Is Owner Operator': employee.is_owner_operator ? 'Yes' : 'No',
      'Preferred Routes': Array.isArray(employee.preferred_location)
        ? employee.preferred_location.join(', ')
        : '',

      // Emergency Contact
      'Emergency Contact Name': employee.emergency_contact_name || '',
      'Emergency Contact Number': employee.emergency_contact_number || '',
      'Emergency Contact Relationship': employee.emergency_contact_relationship || '',

      // Active Status
      'Active Status': employee.active_status || '',

      // Timestamps
      'Created At': employee.created_at || '',
      'Last Updated At': employee.last_updated_at || '',
    };

    // Flatten applicant information if available
    if (employee.applicant) {
      flatData['Applicant ID'] = employee.applicant.id || '';
      flatData['Applicant Status'] = employee.applicant.status || '';
    }

    // Flatten equipment experience - up to 5
    if (employee.equipment_experience && Array.isArray(employee.equipment_experience)) {
      const equipment = employee.equipment_experience.slice(0, 5);
      equipment.forEach((exp, index) => {
        const num = index + 1;
        flatData[`Equipment ${num} Type`] = exp.type || '';
        flatData[`Equipment ${num} Years`] = exp.years || '';
      });
    }

    // Flatten equipment owned - up to 3
    if (employee.equipment_owned && Array.isArray(employee.equipment_owned)) {
      const owned = employee.equipment_owned.slice(0, 3);
      owned.forEach((equipment, index) => {
        const num = index + 1;
        flatData[`Owned Equipment ${num} Type`] = equipment.type || '';
        flatData[`Owned Equipment ${num} Quantity`] = equipment.quantity || '';
      });
    }

    return flatData;
  }

  static exportEmployeesToCSV(employees: EmployeeEntity[], filename?: string): void {
    if (!employees || employees.length === 0) {
      console.warn('No employees to export');
      return;
    }

    // Flatten all employees
    const flattenedData = employees.map(employee =>
      this.flattenEmployeeForCSV(employee)
    );

    // Convert to CSV using PapaParse
    const csv = Papa.unparse(flattenedData, {
      quotes: true,
      header: true,
    });

    // Create download
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFilename = filename || `employees-export-${timestamp}.csv`;

    this.downloadCSV(csv, finalFilename);
  }

  static exportEmployeeToCSV(employee: EmployeeEntity, filename?: string): void {
    this.exportEmployeesToCSV([employee], filename);
  }

  private static downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }
}
