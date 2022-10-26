export type ProtectedFields = {
    license_number?: boolean | (() => boolean);
    social_security_number?:  boolean | (() => boolean);
}