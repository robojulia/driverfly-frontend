import { JobEntity } from '../models/job/job.entity';
import { CompanyEntity } from '../models/company/company.entity';
import { EducationLevel } from '../enums/users/education-level.enum';
import { JobBenefits } from '../enums/jobs/job-benefits.enum';
import { JobEquipmentType } from '../enums/jobs/job-equipment-type.enum';
import { JobGeography } from '../enums/jobs/job-geography.enum';
import { JobPayMethod } from '../enums/jobs/job-pay-method.enum';
import { Status } from '../enums/status.enum';

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

interface IndeedJobData {
  referencenumber: string;
  title: string;
  description: string;
  city: string;
  state: string;
  country: string;
  postalcode: string;
  company: string;
  url: string;
  date: string;
  experience?: string;
  salary?: string;
  education?: string;
  category: string;
  expire?: string;
}

export class JobIndeedExporter {
  /**
   * Generates a complete Indeed XML feed for multiple jobs
   */
  static generateXMLFeed(jobs: JobEntity[], company: CompanyEntity, baseUrl: string = ''): string {
    const lastBuildDate = new Date().toISOString().split('T')[0];
    const publisherUrl = company.website || baseUrl || 'https://driverfly.com';

    const jobsXML = jobs
      .filter(job => this.validateJobForIndeed(job).valid)
      .map(job => this.generateJobXML(job, baseUrl))
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<source>
  <publisher>${this.sanitizeForXML(company.name || 'DriverFly')}</publisher>
  <publisherurl>${this.sanitizeForXML(publisherUrl)}</publisherurl>
  <lastBuildDate>${lastBuildDate}</lastBuildDate>
${jobsXML}
</source>`;
  }

  /**
   * Generates XML for a single job
   */
  private static generateJobXML(job: JobEntity, baseUrl: string = ''): string {
    const jobData = this.mapJobToIndeedXML(job, baseUrl);

    return `  <job>
    <referencenumber>${jobData.referencenumber}</referencenumber>
    <title>${this.sanitizeForXML(jobData.title)}</title>
    <description><![CDATA[${jobData.description}]]></description>
    <city>${this.sanitizeForXML(jobData.city)}</city>
    <state>${this.sanitizeForXML(jobData.state)}</state>
    <country>${jobData.country}</country>
    <postalcode>${this.sanitizeForXML(jobData.postalcode)}</postalcode>
    <company>${this.sanitizeForXML(jobData.company)}</company>
    <url>${this.sanitizeForXML(jobData.url)}</url>
    <date>${jobData.date}</date>${jobData.experience ? `\n    <experience>${this.sanitizeForXML(jobData.experience)}</experience>` : ''}${jobData.salary ? `\n    <salary>${this.sanitizeForXML(jobData.salary)}</salary>` : ''}${jobData.education ? `\n    <education>${this.sanitizeForXML(jobData.education)}</education>` : ''}
    <category>${this.sanitizeForXML(jobData.category)}</category>${jobData.expire ? `\n    <expire>${jobData.expire}</expire>` : ''}
  </job>`;
  }

  /**
   * Maps a JobEntity to Indeed XML structure
   */
  static mapJobToIndeedXML(job: JobEntity, baseUrl: string = ''): IndeedJobData {
    const isExpired = job.status !== Status.ACTIVE ||
                     (job.expiry_date && new Date(job.expiry_date) < new Date());

    // Use zip code from job location, fallback to empty string (Indeed will still accept it)
    const postalCode = job.location?.zip_code || '';

    return {
      referencenumber: String(job.id),
      title: job.title || 'Untitled Position',
      description: this.formatDescription(job),
      city: job.location?.city || '',
      state: job.location?.state || '',
      country: 'US',
      postalcode: postalCode,
      company: job.company?.name || 'Company',
      url: this.buildApplyUrl(job, baseUrl),
      date: this.formatDate(job.created_at),
      experience: this.mapExperienceLevel(job.min_years_experience),
      salary: this.formatSalary(job),
      education: this.mapEducationLevel(job.min_degree),
      category: 'Transportation',
      expire: isExpired ? '1' : undefined,
    };
  }

  /**
   * Validates that a job has all required fields for Indeed export
   */
  static validateJobForIndeed(job: JobEntity): ValidationResult {
    const errors: string[] = [];

    if (!job.title) {
      errors.push('Job title is required');
    }

    if (!job.description) {
      errors.push('Job description is required');
    }

    if (!job.location?.city) {
      errors.push('City is required');
    }

    if (!job.location?.state) {
      errors.push('State is required');
    }

    if (!job.location?.zip_code) {
      errors.push('Zip code is required');
    }

    if (!job.company?.name) {
      errors.push('Company name is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Sanitizes text for safe XML output
   */
  static sanitizeForXML(text: string | number | undefined): string {
    if (text === undefined || text === null) {
      return '';
    }

    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Formats the job description with additional details
   */
  static formatDescription(job: JobEntity): string {
    let description = job.description || '';

    // Add geography information
    if (job.geography) {
      description += `\n\n<strong>Route Type:</strong> ${this.formatEnumValue(job.geography)}`;
    }

    // Add schedule information
    if (job.schedule) {
      let scheduleText = this.formatEnumValue(job.schedule);
      if (job.schedule_other) {
        scheduleText += ` - ${job.schedule_other}`;
      }
      description += `\n<strong>Schedule:</strong> ${scheduleText}`;
    }

    // Add employment type
    if (job.employment_type) {
      description += `\n<strong>Employment Type:</strong> ${this.formatEnumValue(job.employment_type)}`;
    }

    // Add equipment types
    if (job.equipment_type && job.equipment_type.length > 0) {
      const equipment = job.equipment_type.map(e => this.formatEnumValue(e)).join(', ');
      description += `\n\n<strong>Equipment Types:</strong> ${equipment}`;
      if (job.equipment_type_other) {
        description += ` (${job.equipment_type_other})`;
      }
    }

    // Add benefits
    if (job.benefits && job.benefits.length > 0) {
      const benefitsList = job.benefits.map(b => this.formatEnumValue(b)).join(', ');
      description += `\n\n<strong>Benefits:</strong> ${benefitsList}`;
      if (job.benefits_other) {
        description += ` - ${job.benefits_other}`;
      }
    }

    // Add CDL requirements
    if (job.cdl_class) {
      description += `\n\n<strong>Required License:</strong> ${this.formatEnumValue(job.cdl_class)}`;
    }

    // Add endorsements
    if (job.required_endorsement && job.required_endorsement.length > 0) {
      const endorsements = job.required_endorsement.map(e => this.formatEnumValue(e)).join(', ');
      description += `\n<strong>Required Endorsements:</strong> ${endorsements}`;
    }

    // Add drug test requirement
    if (job.must_pass_drug_test) {
      description += `\n\n<strong>Drug Testing:</strong> Required`;
    }

    // Add MVR requirement
    if (job.must_have_clean_mvr) {
      description += `\n<strong>MVR:</strong> Clean driving record required`;
    }

    return description;
  }

  /**
   * Formats salary information
   */
  private static formatSalary(job: JobEntity): string | undefined {
    if (job.min_weekly_pay && job.max_weekly_pay) {
      return `$${job.min_weekly_pay.toLocaleString()} - $${job.max_weekly_pay.toLocaleString()} per week`;
    } else if (job.min_weekly_pay) {
      return `From $${job.min_weekly_pay.toLocaleString()} per week`;
    } else if (job.max_weekly_pay) {
      return `Up to $${job.max_weekly_pay.toLocaleString()} per week`;
    }

    // Try annual salary
    if (job.min_salary && job.max_salary) {
      return `$${job.min_salary.toLocaleString()} - $${job.max_salary.toLocaleString()} per year`;
    } else if (job.min_salary) {
      return `From $${job.min_salary.toLocaleString()} per year`;
    } else if (job.max_salary) {
      return `Up to $${job.max_salary.toLocaleString()} per year`;
    }

    // Try hourly rate
    if (job.min_rate && job.max_rate && job.pay_method === JobPayMethod.HOURLY) {
      return `$${job.min_rate} - $${job.max_rate} per hour`;
    } else if (job.min_rate && job.pay_method === JobPayMethod.HOURLY) {
      return `From $${job.min_rate} per hour`;
    }

    // Try per mile rate
    if (job.min_rate && job.max_rate && job.pay_method === JobPayMethod.RATE_PER_MILE) {
      return `$${job.min_rate} - $${job.max_rate} per mile`;
    }

    return undefined;
  }

  /**
   * Maps experience years to Indeed experience level
   */
  private static mapExperienceLevel(years: number | undefined): string | undefined {
    if (years === undefined || years === null) {
      return undefined;
    }

    if (years === 0) {
      return 'Entry Level';
    } else if (years <= 2) {
      return 'Entry Level';
    } else if (years <= 5) {
      return 'Mid Level';
    } else {
      return 'Senior Level';
    }
  }

  /**
   * Maps EducationLevel enum to Indeed education format
   */
  private static mapEducationLevel(degree: EducationLevel | undefined): string | undefined {
    if (!degree) {
      return undefined;
    }

    const mapping: Record<EducationLevel, string> = {
      [EducationLevel.HIGH_SCHOOL]: 'High School',
      [EducationLevel.SOME_COLLEGE]: 'Some College',
      [EducationLevel.ASSOCIATE]: 'Associate',
      [EducationLevel.BACHELOR]: 'Bachelor',
      [EducationLevel.MASTER]: 'Master',
      [EducationLevel.DOCTORAL]: 'Doctorate',
    };

    return mapping[degree];
  }

  /**
   * Builds the apply URL for a job
   */
  private static buildApplyUrl(job: JobEntity, baseUrl: string = ''): string {
    const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://driverfly.com');
    return `${base}/jobs/${job.id}/${job.slug || 'apply'}`;
  }

  /**
   * Formats a date to YYYY-MM-DD format
   */
  private static formatDate(date: string | Date | undefined): string {
    if (!date) {
      return new Date().toISOString().split('T')[0];
    }

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString().split('T')[0];
  }

  /**
   * Formats enum values to human-readable strings
   */
  private static formatEnumValue(value: string): string {
    return value
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  /**
   * Downloads the XML feed as a file
   */
  static downloadXMLFeed(xml: string, filename: string = 'indeed-feed.xml'): void {
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
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
