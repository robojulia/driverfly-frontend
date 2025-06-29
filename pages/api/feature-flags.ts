import BaseApi from './_baseApi';

export interface FeatureFlag {
  id: number;
  key: string;
  name: string;
  description?: string;
  enabled: boolean;
  conditions?: any;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}

export interface CreateFeatureFlagDto {
  key: string;
  name: string;
  description?: string;
  enabled?: boolean;
  conditions?: any;
}

export interface UpdateFeatureFlagDto extends Partial<CreateFeatureFlagDto> {}

export interface FeatureFlagQuery {
  enabled?: boolean;
  keys?: string[];
}

export interface FeatureFlagEvaluation {
  key: string;
  enabled: boolean;
  reason: string;
}

export default class FeatureFlagsApi extends BaseApi {
  constructor() {
    super();
  }

  /**
   * Get all feature flags with optional filtering
   */
  async getAll(query?: FeatureFlagQuery): Promise<FeatureFlag[]> {
    const url = this.buildUrl('/feature-flags', query);
    const response = await this.get(url, { headers: {} }); // Empty headers to avoid auth
    return response.data;
  }

  /**
   * Get a single feature flag by ID
   */
  async getById(id: number): Promise<FeatureFlag> {
    const url = `/feature-flags/${id}`;
    const response = await this.get(url, { headers: {} }); // Empty headers to avoid auth
    return response.data;
  }

  /**
   * Create a new feature flag (requires super admin)
   */
  async create(data: CreateFeatureFlagDto): Promise<FeatureFlag> {
    const url = '/feature-flags';
    const response = await this.post(url, data);
    return response.data;
  }

  /**
   * Update an existing feature flag (requires super admin)
   */
  async update(id: number, data: UpdateFeatureFlagDto): Promise<FeatureFlag> {
    const url = `/feature-flags/${id}`;
    const response = await this.put(url, data);
    return response.data;
  }

  /**
   * Delete a feature flag (requires super admin)
   */
  async deleteFlag(id: number): Promise<void> {
    const url = `/feature-flags/${id}`;
    await super.delete(url);
  }

  /**
   * Evaluate a single feature flag
   */
  async evaluate(key: string, userId?: number, companyId?: number): Promise<FeatureFlagEvaluation> {
    const params: any = {};
    if (userId) params.userId = userId;
    if (companyId) params.companyId = companyId;

    const url = this.buildUrl(`/feature-flags/evaluate/${key}`, params);
    const response = await this.get(url, { headers: {} }); // Empty headers to avoid auth
    return response.data;
  }

  /**
   * Evaluate multiple feature flags
   */
  async evaluateMultiple(
    keys: string[],
    userId?: number,
    companyId?: number
  ): Promise<FeatureFlagEvaluation[]> {
    const params: any = { keys: keys.join(',') };
    if (userId) params.userId = userId;
    if (companyId) params.companyId = companyId;

    const url = this.buildUrl('/feature-flags/evaluate', params);
    const response = await this.get(url, { headers: {} }); // Empty headers to avoid auth
    return response.data;
  }

  /**
   * Get all enabled features for the current context
   */
  async getEnabledFeatures(userId?: number, companyId?: number): Promise<Record<string, boolean>> {
    const params: any = {};
    if (userId) params.userId = userId;
    if (companyId) params.companyId = companyId;

    const url = this.buildUrl('/feature-flags/enabled', params);
    const response = await this.get(url, { headers: {} }); // Empty headers to avoid auth
    return response.data;
  }
}
