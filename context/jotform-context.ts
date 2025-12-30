import { createContext } from 'react';
import { ApplicantEmployerEntity } from '../models/applicant';
import { ApplicantExtrasEntity } from '../models/applicant/applicant-extras.entity';
import { ApplicantEntity } from '../models/applicant/applicant.entity';
import { JobEntity } from '../models/job/job.entity';
import { CompanyPreferenceEntity } from '../models/company/company-preferences.entity';
import { UtmReferral } from '../models/auth/utm-referral.interface';
import { CompanyEntity } from '../models/company/company.entity';

export type JotFormContextType = {
  state: {
    applicant?: ApplicantEntity;
    company?: CompanyEntity;
    companyJobs?: JobEntity[];
    jobs?: JobEntity[];
    companyPreferences?: CompanyPreferenceEntity[];
    applicantExtras?: ApplicantExtrasEntity[];
    steps?: number;
    utm?: UtmReferral;
    directJobId?: number | null;
    directJob?: JobEntity | null;
    isDirectJobApplication?: boolean;
    isEditingExistingApplicant?: boolean;
    isPrefilled?: boolean;
    isEditingFromSummary?: boolean;
  };
  method: {
    setApplicant?: (e?: any) => void;
    setJobs?: (e?: any) => void;
    setCompanyJobs?: (e?: any) => void;
    updateApplicantExtras?: (e?: any) => void;
    setApplicantExtras?: (e?: any) => void;
    setSteps?: (e?: any) => void;
    stepNext?: () => void;
    stepBack?: () => void;
    setDirectJob?: (job: JobEntity | null) => void;
    setIsEditingExistingApplicant?: (isEditing: boolean) => void;
    setIsPrefilled?: (isPrefilled: boolean) => void;
    setIsEditingFromSummary?: (isEditing: boolean) => void;
  };
};

const JotformContext = createContext<JotFormContextType>({
  state: {
    applicant: null,
    applicantExtras: [],
    jobs: [],
    companyJobs: [],
    companyPreferences: [],
    steps: 0,
    utm: {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      referral_name: null,
    },
    directJobId: null,
    directJob: null,
    isDirectJobApplication: false,
    isEditingExistingApplicant: false,
    isPrefilled: false,
    isEditingFromSummary: false,
  },
  method: {
    setApplicant: (e?: any) => {},
    setApplicantExtras: (e?: any) => {},
    updateApplicantExtras: (e?: any) => {},
    setJobs: (e?: any) => {},
    setCompanyJobs: (e?: any) => {},
    setSteps: (e?: any) => {},
    stepNext: () => {},
    stepBack: () => {},
    setDirectJob: (job: JobEntity | null) => {},
    setIsEditingExistingApplicant: (isEditing: boolean) => {},
    setIsPrefilled: (isPrefilled: boolean) => {},
    setIsEditingFromSummary: (isEditing: boolean) => {},
  },
});
export default JotformContext;
