export interface LocationEntity {
    id?: number;
    version?: number;
    street: string;
    city?: string;
    state?: string;
    zip_code?: string;
    forwardGeocodeId?: number;
    countyId?: number;
    neighborhoodId?: number;
    latitude?: number;
    longitude?: number;
    created_at: Date;
    last_updated_at?: Date;
}
