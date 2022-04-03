import { DriverEntity } from './Driver.entity';

export enum DriverPreferenceCategory {
  COMMUNICATION = 'COMMUNICATION',
  SHARING = 'SHARING',
  MATCHING = 'MATCHING',
}

export interface DriverPreferenceEntity {
  id?: number;
  driver?: DriverEntity;
  category?: string;
  label?: string;
  value?: string;
}
