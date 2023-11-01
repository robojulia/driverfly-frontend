import { createContext } from "react";
import { ApplicantEmployerEntity } from "../models/applicant";
import { ApplicantExtrasEntity } from "../models/applicant/applicant-extras.entity";
import { ApplicantEntity } from "../models/applicant/applicant.entity";
import { JobEntity } from "../models/job/job.entity";
import { CompanyPreferenceEntity } from "../models/company/company-preferences.entity";

export type JotFormContextType = {
	state: {
		applicant?: ApplicantEntity;
		jobs?: JobEntity[];
		companyPreferences?: CompanyPreferenceEntity[];
		applicantExtras?: ApplicantExtrasEntity[];
		steps?: number;
		utm?: {
			utm_source?: string;
			utm_medium?: string;
			utm_campaign?: string;
			utm_content?: string;
		}
	};
	method: {
		setApplicant?: (e?: any) => void;
		setJobs?: (e?: any) => void;
		updateApplicantExtras?: (e?: any) => void;
		setApplicantExtras?: (e?: any) => void;
		stepNext?: () => void;
		stepBack?: () => void;
	};
};

const JotformContext = createContext<JotFormContextType>({
	state: {
		applicant: null,
		applicantExtras: [],
		jobs: [],
		companyPreferences: [],
		steps: 0,
		utm: {
			utm_source: null,
			utm_medium: null,
			utm_campaign: null,
			utm_content: null,
		}
	},
	method: {
		setApplicant: (e?: any) => { },
		setApplicantExtras: (e?: any) => { },
		updateApplicantExtras: (e?: any) => { },
		stepNext: () => { },
		stepBack: () => { },
	},
});
export default JotformContext;
