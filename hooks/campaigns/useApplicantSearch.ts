import { useState, useCallback } from 'react';
import ApplicantApi from '../../pages/api/applicant';

export interface ApplicantLite {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  fullName: string;
}

export interface SearchApplicantsLiteResponse {
  applicants: ApplicantLite[];
  total: number;
}

export interface SearchApplicantsLiteParams {
  search?: string;
  limit?: number;
  offset?: number;
}

export function useApplicantSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const applicantApi = new ApplicantApi();

  const searchApplicants = useCallback(
    async (params: SearchApplicantsLiteParams): Promise<SearchApplicantsLiteResponse> => {
      setLoading(true);
      setError(null);

      try {
        const response = await applicantApi.searchLite(params);
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to search applicants';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [applicantApi]
  );

  return {
    searchApplicants,
    loading,
    error,
  };
}
