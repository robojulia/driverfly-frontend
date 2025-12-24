import * as yup from "yup";

export class CampaignRequestDTO {
    communicationType: string;
    campaignType: string;
    targetAudience: string;
    budgetRangeMax: number;
    desiredStartDate: Date;
    goals: string;
    personaGender?: string;
    personaAccent?: string;
    personaTone?: string;
    personaName?: string;

    static yupSchema() {
        return yup.object({
            communicationType: yup.string().trim().required('Communication type is required').nullable(),
            campaignType: yup.string().trim().required('Campaign type is required').nullable(),
            targetAudience: yup.string().trim().required('Target audience description is required').min(10, 'Please provide at least 10 characters').max(500, 'Maximum 500 characters allowed').nullable(),
            budgetRangeMax: yup.number().required('Maximum budget is required').min(0, 'Budget cannot be negative').nullable(),
            desiredStartDate: yup.date().required('Desired start date is required').min(new Date(), 'Start date must be in the future').nullable(),
            goals: yup.string().trim().required('Campaign goals are required').min(20, 'Please provide at least 20 characters').max(1000, 'Maximum 1000 characters allowed').nullable(),
            personaGender: yup.string().trim().nullable(),
            personaAccent: yup.string().trim().nullable(),
            personaTone: yup.string().trim().nullable(),
            personaName: yup.string().trim().nullable(),
        });
    }
}
