export enum DocumentType {
    RESUME = 'RESUME',
    MVR = 'MVR',
    DRIVER_LICENSE = 'DRIVER_LICENSE',
    MEDICAL_CARD = 'MEDICAL_CARD',
}
  
export interface DocumentEntity {
    id: number;
    name: string;
    description: string;
    path: string;
    type: string;
    documentable_id: number;
    documentable_type: string;
    // user: UserEntity;
  }
  