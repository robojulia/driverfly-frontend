import BaseApi from './_baseApi';

export interface TwilioPhoneNumberInfo {
  sid: string;
  accountSid: string;
  friendlyName: string;
  phoneNumber: string;
  voiceUrl: string;
  voiceMethod: string;
  voiceFallbackUrl: string;
  voiceFallbackMethod: string;
  smsUrl: string;
  smsMethod: string;
  smsFallbackUrl: string;
  smsFallbackMethod: string;
  statusCallback: string;
  statusCallbackMethod: string;
  voiceReceiveMode: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
    fax: boolean;
  };
  beta: boolean;
  dateCreated: Date;
  dateUpdated: Date;
  origin: string;
  trunkSid?: string;
  emergencyStatus: string;
  emergencyAddressSid?: string;
  bundleSid?: string;
  identitySid?: string;
  isManaged: boolean;
  managedBy?: {
    id: number;
    name: string;
  };
  usage?: {
    incomingCalls: number;
    outgoingCalls: number;
    incomingSms: number;
    outgoingSms: number;
  };
}

export interface PhoneNumbersSummary {
  total: number;
  managed: number;
  unmanaged: number;
  byCapabilities: {
    voice: number;
    sms: number;
    mms: number;
    fax: number;
  };
  companies: string[];
}

export default class PhoneNumbersApi extends BaseApi {
  /**
   * Get all phone numbers with management status
   */
  async getAllPhoneNumbers(): Promise<TwilioPhoneNumberInfo[]> {
    const response = await this.get('/twilio/admin/phone-numbers');
    return response.data;
  }

  /**
   * Get detailed information for a specific phone number
   */
  async getPhoneNumberDetails(phoneNumber: string): Promise<TwilioPhoneNumberInfo> {
    const response = await this.get(
      `/twilio/admin/phone-numbers/${encodeURIComponent(phoneNumber)}`
    );
    return response.data;
  }

  /**
   * Get summary statistics for all phone numbers
   */
  async getPhoneNumbersSummary(): Promise<PhoneNumbersSummary> {
    const response = await this.get('/twilio/admin/phone-numbers-summary');
    return response.data;
  }

  /**
   * Get usage statistics for a specific phone number
   */
  async getPhoneNumberUsage(phoneNumber: string, startDate?: Date, endDate?: Date): Promise<any> {
    const params: any = {};
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();

    const url = this.buildUrl(
      `/twilio/admin/phone-numbers/${encodeURIComponent(phoneNumber)}/usage`,
      params
    );
    const response = await this.get(url);
    return response.data;
  }

  /**
   * Update the friendly name of a phone number
   */
  async updatePhoneNumberFriendlyName(
    phoneNumber: string,
    friendlyName: string
  ): Promise<TwilioPhoneNumberInfo> {
    const response = await this.post(
      `/twilio/admin/phone-numbers/${encodeURIComponent(phoneNumber)}/update-friendly-name`,
      { friendlyName }
    );
    return response.data;
  }
}
