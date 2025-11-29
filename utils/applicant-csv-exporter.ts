import Papa from 'papaparse';
import { ApplicantEntity } from '../models/applicant/applicant.entity';

export class ApplicantCSVExporter {
  static flattenApplicantForCSV(applicant: ApplicantEntity): Record<string, any> {
    const flatData: Record<string, any> = {
      // Core Identity
      'ID': applicant.id || '',
      'First Name': applicant.first_name || '',
      'Last Name': applicant.last_name || '',
      'Email': applicant.email || '',
      'Phone': applicant.phone || '',
      'Birthdate': applicant.birthdate || '',

      // Address
      'Address Line 1': applicant.address_1 || '',
      'Address Line 2': applicant.address_2 || '',
      'Street': applicant.street || '',
      'City': applicant.city || '',
      'State': applicant.state || '',
      'Zip Code': applicant.zip_code || '',

      // Application Status
      'Status': applicant.status || '',
      'Current Application Status': applicant.current_application_status || '',
      'Is Hired': applicant.is_hired ? 'Yes' : 'No',

      // Licensing Information
      'License Number': applicant.license_number || '',
      'License State': applicant.license_state || '',
      'License Type': applicant.license_type || '',
      'License Expiry': applicant.license_expiry || '',
      'Years CDL Experience': applicant.years_cdl_experience || '',
      'License Restrictions': Array.isArray(applicant.license_restrictions)
        ? applicant.license_restrictions.join(', ')
        : '',
      'License Restrictions Other': applicant.license_restrictions_other || '',
      'Endorsements': Array.isArray(applicant.endorsements)
        ? applicant.endorsements.join(', ')
        : '',
      'Endorsements Other': applicant.endorsements_other || '',
      'Transmission Type': Array.isArray(applicant.transmission_type)
        ? applicant.transmission_type.join(', ')
        : '',

      // Education
      'Highest Degree': applicant.highest_degree || '',

      // Work Authorization
      'Authorized to Work in US': applicant.authorized_to_work_in_us ? 'Yes' : 'No',

      // Safety & Background
      'Has Past DUI': applicant.has_past_dui ? 'Yes' : 'No',
      'DUI Years': Array.isArray(applicant.dui_years)
        ? applicant.dui_years.join(', ')
        : '',
      'Criminal History': applicant.criminal_history ? 'Yes' : 'No',
      'License Revoked': applicant.license_revoked ? 'Yes' : 'No',
      'License Revoked Details': applicant.license_revoked_details || '',

      // Accidents
      'Accident Count': applicant.accident_count || 0,
      'Accident Details': applicant.accident_details || '',

      // Violations & Infractions
      'PSP Violations': applicant.psp_violations ? 'Yes' : 'No',
      'PSP Violations Details': applicant.psp_violations_details || '',
      'Tickets': applicant.tickets ? 'Yes' : 'No',
      'Tickets Count': applicant.tickets_count || 0,
      'Tickets Details': applicant.tickets_details || '',
      'Infractions': applicant.infractions ? 'Yes' : 'No',
      'Infractions Count': applicant.infractions_count || 0,
      'Infractions Details': applicant.infractions_details || '',
      'Moving Violations': applicant.moving_violations ? 'Yes' : 'No',
      'Moving Violations Count': applicant.moving_violations_count || 0,
      'Moving Violations Details': applicant.moving_violations_details || '',

      // Drug Testing
      'Can Pass Drug Test': applicant.can_pass_drug_test ? 'Yes' : 'No',
      'Must Pass Drug Test': applicant.must_pass_drug_test ? 'Yes' : 'No',
      'Positive Drug Test': applicant.positive_drug_test ? 'Yes' : 'No',
      'Positive Drug Test Details': applicant.positive_drug_test_details || '',
      'Is SAP Participant': applicant.is_sap_participant ? 'Yes' : 'No',

      // Preferences
      'Is Owner Operator': applicant.is_owner_operator ? 'Yes' : 'No',
      'Routes': Array.isArray(applicant.routes)
        ? applicant.routes.join(', ')
        : '',
      'Preferred Location': Array.isArray(applicant.preferred_location)
        ? applicant.preferred_location.join(', ')
        : '',

      // Emergency Contact
      'Emergency Contact Name': applicant.emergency_contact_name || '',
      'Emergency Contact Number': applicant.emergency_contact_number || '',
      'Emergency Contact Relationship': applicant.emergency_contact_relationship || '',

      // Employment Gap
      'Employment Gap Details': applicant.employment_gap_details || '',

      // Other
      'Remarks': applicant.remarks || '',
      'SSN Last 4': applicant.ssn_last4 || '',
      'Authorize to Communicate': applicant.authorize_to_communicate ? 'Yes' : 'No',
      'Referral Source': applicant.referralSource?.name || '',

      // Timestamps
      'Created At': applicant.created_at || '',
      'Last Updated At': applicant.last_updated_at || '',
    };

    // Flatten work history (employers) - up to 5 most recent
    if (applicant.employers && Array.isArray(applicant.employers)) {
      const employers = applicant.employers.slice(0, 5);
      employers.forEach((employer, index) => {
        const num = index + 1;
        flatData[`Employer ${num} Name`] = employer.name || '';
        flatData[`Employer ${num} Position`] = employer.title || '';
        flatData[`Employer ${num} Start Date`] = employer.start_at || '';
        flatData[`Employer ${num} End Date`] = employer.end_at || '';
        flatData[`Employer ${num} City`] = employer.city || '';
        flatData[`Employer ${num} State`] = employer.state || '';
      });
    }

    // Flatten job applications - up to 3 most recent
    if (applicant.jobs && Array.isArray(applicant.jobs)) {
      const jobs = applicant.jobs.slice(0, 3);
      jobs.forEach((jobApp, index) => {
        const num = index + 1;
        flatData[`Job ${num} Title`] = jobApp.job?.title || '';
        flatData[`Job ${num} Status`] = jobApp.status || '';
        flatData[`Job ${num} Applied At`] = jobApp.created_at || '';
      });
    }

    // Flatten equipment experience - up to 5
    if (applicant.equipment_experience && Array.isArray(applicant.equipment_experience)) {
      const equipment = applicant.equipment_experience.slice(0, 5);
      equipment.forEach((exp, index) => {
        const num = index + 1;
        flatData[`Equipment ${num} Type`] = exp.type || '';
        flatData[`Equipment ${num} Years`] = exp.years || '';
      });
    }

    return flatData;
  }

  static exportApplicantsToCSV(applicants: ApplicantEntity[], filename?: string): void {
    if (!applicants || applicants.length === 0) {
      console.warn('No applicants to export');
      return;
    }

    // Flatten all applicants
    const flattenedData = applicants.map(applicant =>
      this.flattenApplicantForCSV(applicant)
    );

    // Convert to CSV using PapaParse
    const csv = Papa.unparse(flattenedData, {
      quotes: true,
      header: true,
    });

    // Create download
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFilename = filename || `applicants-export-${timestamp}.csv`;

    this.downloadCSV(csv, finalFilename);
  }

  static exportApplicantToCSV(applicant: ApplicantEntity, filename?: string): void {
    this.exportApplicantsToCSV([applicant], filename);
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
