import { JobEntity } from '../models/job/job.entity';
import { CompanyEntity } from '../models/company/company.entity';
import { JobEmploymentType } from '../enums/jobs/job-employment-type.enum';
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
  salary?: string;
  jobtype?: string;
  category: string;
  expire?: string;
}

export class JobIndeedExporter {
  /**
   * Generates a complete Indeed XML feed for multiple jobs
   */
  static generateXMLFeed(jobs: JobEntity[], company: CompanyEntity, baseUrl: string = ''): string {
    const lastBuildDate = this.formatIndeedDate(new Date());
    const publisherUrl = company.website || baseUrl || 'https://driverfly.com';
    const companyName = company.name || 'DriverFly';

    const jobsXML = jobs
      .filter(job => this.validateJobForIndeed(job).valid)
      .map(job => this.generateJobXML(job, companyName, baseUrl))
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<source>
  <publisher>${this.sanitizeForXML(companyName)}</publisher>
  <publisherurl>${this.sanitizeForXML(publisherUrl)}</publisherurl>
  <lastBuildDate>${lastBuildDate}</lastBuildDate>
${jobsXML}
</source>`;
  }

  /**
   * Generates XML for a single job
   */
  private static generateJobXML(job: JobEntity, companyName: string, baseUrl: string = ''): string {
    const jobData = this.mapJobToIndeedXML(job, companyName, baseUrl);

    const optional = [
      jobData.salary ? `\n    <salary>${this.sanitizeForXML(jobData.salary)}</salary>` : '',
      jobData.jobtype ? `\n    <jobtype>${jobData.jobtype}</jobtype>` : '',
      jobData.expire ? `\n    <expire>${jobData.expire}</expire>` : '',
    ].join('');

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
    <date>${jobData.date}</date>
    <category>${this.sanitizeForXML(jobData.category)}</category>${optional}
  </job>`;
  }

  /**
   * Maps a JobEntity to Indeed XML structure
   */
  static mapJobToIndeedXML(job: JobEntity, companyName: string, baseUrl: string = ''): IndeedJobData {
    // Include expiry date if the job has one in the future — lets Indeed auto-remove it
    const expireDate = job.expiry_date ? new Date(job.expiry_date) : null;
    const expire = expireDate && expireDate > new Date()
      ? this.formatIndeedDate(expireDate)
      : undefined;

    return {
      referencenumber: String(job.id),
      title: job.title || 'Untitled Position',
      description: this.formatDescription(job),
      city: job.location?.city || '',
      state: job.location?.state || '',
      country: 'US',
      postalcode: job.location?.zip_code || '',
      company: companyName,
      url: this.buildApplyUrl(job, baseUrl),
      date: this.formatIndeedDate(job.created_at ? new Date(job.created_at) : new Date()),
      salary: this.formatSalary(job),
      jobtype: this.mapJobType(job.employment_type),
      category: 'Transportation',
      expire,
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

    if (job.geography) {
      description += `\n\n<strong>Route Type:</strong> ${this.formatEnumValue(job.geography)}`;
    }

    if (job.schedule) {
      let scheduleText = this.formatEnumValue(job.schedule);
      if (job.schedule_other) scheduleText += ` - ${job.schedule_other}`;
      description += `\n<strong>Schedule:</strong> ${scheduleText}`;
    }

    if (job.employment_type) {
      description += `\n<strong>Employment Type:</strong> ${this.formatEnumValue(job.employment_type)}`;
    }

    if (job.equipment_type && job.equipment_type.length > 0) {
      const equipment = job.equipment_type.map(e => this.formatEnumValue(e)).join(', ');
      description += `\n\n<strong>Equipment Types:</strong> ${equipment}`;
      if (job.equipment_type_other) description += ` (${job.equipment_type_other})`;
    }

    if (job.benefits && job.benefits.length > 0) {
      const benefitsList = job.benefits.map(b => this.formatEnumValue(b)).join(', ');
      description += `\n\n<strong>Benefits:</strong> ${benefitsList}`;
      if (job.benefits_other) description += ` - ${job.benefits_other}`;
    }

    if (job.cdl_class) {
      description += `\n\n<strong>Required License:</strong> ${this.formatEnumValue(job.cdl_class)}`;
    }

    if (job.required_endorsement && job.required_endorsement.length > 0) {
      const endorsements = job.required_endorsement.map(e => this.formatEnumValue(e)).join(', ');
      description += `\n<strong>Required Endorsements:</strong> ${endorsements}`;
    }

    if (job.must_pass_drug_test) {
      description += `\n\n<strong>Drug Testing:</strong> Required`;
    }

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

    if (job.min_salary && job.max_salary) {
      return `$${job.min_salary.toLocaleString()} - $${job.max_salary.toLocaleString()} per year`;
    } else if (job.min_salary) {
      return `From $${job.min_salary.toLocaleString()} per year`;
    } else if (job.max_salary) {
      return `Up to $${job.max_salary.toLocaleString()} per year`;
    }

    if (job.pay_method === JobPayMethod.HOURLY && job.min_rate && job.max_rate) {
      return `$${job.min_rate} - $${job.max_rate} per hour`;
    } else if (job.pay_method === JobPayMethod.HOURLY && job.min_rate) {
      return `From $${job.min_rate} per hour`;
    }

    if (job.pay_method === JobPayMethod.RATE_PER_MILE && job.min_rate && job.max_rate) {
      return `$${job.min_rate} - $${job.max_rate} per mile`;
    }

    return undefined;
  }

  /**
   * Maps employment type to Indeed's jobtype values
   */
  private static mapJobType(type: JobEmploymentType | undefined): string | undefined {
    if (!type) return undefined;
    const map: Partial<Record<JobEmploymentType, string>> = {
      [JobEmploymentType.W2]: 'fulltime',
      [JobEmploymentType.CONTRACT]: 'contract',
      [JobEmploymentType.OWNER_OPERATOR]: 'contract',
      [JobEmploymentType.PART_TIME]: 'parttime',
      [JobEmploymentType.SEASONAL]: 'temporary',
      [JobEmploymentType.ONE_TIME_GIG]: 'temporary',
    };
    return map[type];
  }

  /**
   * Formats a date to Indeed's YYYY/MM/DD format
   */
  private static formatIndeedDate(date: Date): string {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}/${m}/${d}`;
  }

  /**
   * Builds the apply URL for a job
   */
  private static buildApplyUrl(job: JobEntity, baseUrl: string = ''): string {
    const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://driverfly.com');
    return `${base}/apply/${job.slug || job.id}`;
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
