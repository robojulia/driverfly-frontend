import BaseApi from './_baseApi';

export type ExpirationField = 'license_expiry' | 'mvr_expiry' | 'medical_card_expiry';

/** Which employees a company-wide rule applies to. A driver's own rules ignore it. */
export type RuleAudience =
  | { type: 'all' }
  | { type: 'owner_operators' }
  | { type: 'company_drivers' }
  | { type: 'positions'; jobIds: number[] };

export interface NotificationRule {
  id: number;
  name: string;
  documentType: string;
  frequency: number;
  frequencyUnit: string;
  startDateType: 'hire_date' | 'custom' | 'expiration_based';
  expirationField?: ExpirationField;
  customStartDate?: string;
  daysBeforeExpiration?: number;
  completeWithinDays?: number;
  notifyDriver: boolean;
  driverNotificationMethods: ('email' | 'sms')[];
  notifyCompany: boolean;
  recipients: string[];
  messageTemplate: string;
  followUpEnabled: boolean;
  followUpDays: number;
  followUpMessageTemplate: string;
  notifyIfIncomplete: boolean;
  enabled: boolean;
  audience: RuleAudience;
}

export interface CompanyNotificationSettings {
  sendingEnabled: boolean;
  rules: NotificationRule[];
  /** False until the company saves for the first time (the rules shown are the defaults). */
  saved: boolean;
}

export interface EmployeeNotificationSettings {
  sendingEnabled: boolean;
  /** True when the driver has their own rules instead of the company-wide ones. */
  custom: boolean;
  rules: NotificationRule[];
  employee: {
    id: number;
    name: string;
    is_owner_operator: boolean;
    jobId: number | null;
    jobTitle: string | null;
    hasEmail: boolean;
    hasMobile: boolean;
  };
}

export interface NotificationLogEntry {
  id: number;
  employeeId: number;
  ruleName: string;
  stage: 'initial' | 'follow_up' | 'incomplete';
  dueDate?: string;
  channels: string;
  recipients?: string;
  message?: string;
  status: 'sent' | 'partial';
  error?: string;
  created_at: string;
}

export default class EmployeeNotificationsApi extends BaseApi {
  private url(companyId: number, path = '') {
    return `company/${companyId}/employee-notifications${path}`;
  }

  async getSettings(companyId: number): Promise<CompanyNotificationSettings> {
    const { data } = await this.get(this.url(companyId, '/settings'));
    return data;
  }

  async saveSettings(companyId: number, dto: { sendingEnabled: boolean; rules: NotificationRule[] }): Promise<CompanyNotificationSettings> {
    const { data } = await this.put(this.url(companyId, '/settings'), dto);
    return data;
  }

  async runNow(companyId: number): Promise<{ sendingEnabled: boolean; employees: number; sent: number }> {
    const { data } = await this.post(this.url(companyId, '/run'), {});
    return data;
  }

  async getLog(companyId: number, limit = 20): Promise<NotificationLogEntry[]> {
    const { data } = await this.get(this.url(companyId, `/log?limit=${limit}`));
    return data;
  }

  async getEmployee(companyId: number, employeeId: number): Promise<EmployeeNotificationSettings> {
    const { data } = await this.get(this.url(companyId, `/employees/${employeeId}`));
    return data;
  }

  async saveEmployee(companyId: number, employeeId: number, rules: NotificationRule[]): Promise<EmployeeNotificationSettings> {
    const { data } = await this.put(this.url(companyId, `/employees/${employeeId}`), { rules });
    return data;
  }

  /** Puts the driver back on the company-wide rules. */
  async clearEmployee(companyId: number, employeeId: number): Promise<EmployeeNotificationSettings> {
    const { data } = await this.delete(this.url(companyId, `/employees/${employeeId}`));
    return data;
  }

  async getEmployeeLog(companyId: number, employeeId: number, limit = 20): Promise<NotificationLogEntry[]> {
    const { data } = await this.get(this.url(companyId, `/employees/${employeeId}/log?limit=${limit}`));
    return data;
  }
}
