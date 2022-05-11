import { DriverEntity } from './Driver.entity';

export enum DriverSafetyQuestionType {
  LICENSE_REVOKED = 'LICENSE_REVOKED',
  VIOLATIONS_PSP = 'VIOLATIONS_PSP',
  TICKETS = 'TICKETS',
  POSITIVE_DRUG_TEST = 'POSITIVE_DRUG_TEST',
}

export interface DriverSafetyQuestionEntity {
  id: number;
  driver: DriverEntity;
  type: DriverSafetyQuestionType;
  response: boolean;
  details?: string;
}
