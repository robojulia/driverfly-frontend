import * as yup from 'yup';

export class InboundRequestDTO {
  businessHoursStart: string;
  businessHoursEnd: string;
  callRoutingGoal: string;
  greeting: string;
  callbackEnabled: boolean;
  goals: string;
  desiredStartDate: Date;
  personaGender?: string;
  personaAccent?: string;
  personaTone?: string;
  personaName?: string;

  static yupSchema() {
    return yup.object({
      businessHoursStart: yup.string().trim().required('Business hours start is required').nullable(),
      businessHoursEnd: yup.string().trim().required('Business hours end is required').nullable(),
      callRoutingGoal: yup.string().trim().required('Call routing goal is required').min(10, 'Please provide at least 10 characters').max(500, 'Maximum 500 characters allowed').nullable(),
      greeting: yup.string().trim().required('Greeting/script preference is required').min(10, 'Please provide at least 10 characters').max(500, 'Maximum 500 characters allowed').nullable(),
      callbackEnabled: yup.boolean().nullable(),
      goals: yup.string().trim().required('Goals are required').min(20, 'Please provide at least 20 characters').max(1000, 'Maximum 1000 characters allowed').nullable(),
      desiredStartDate: yup.date().required('Desired start date is required').min(new Date(), 'Start date must be in the future').nullable(),
      personaGender: yup.string().trim().nullable(),
      personaAccent: yup.string().trim().nullable(),
      personaTone: yup.string().trim().nullable(),
      personaName: yup.string().trim().nullable(),
    });
  }
}
