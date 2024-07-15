export interface BaseFormProps<T> {
    entity?: T;
    className?: string;
    onSaveComplete?: (e: T) => void;
    setApplicant?: (e: T) => void;
    setRefetchApplicant?: (e: T) => boolean;
    onSaveError?: (e?: Error) => void;
}
