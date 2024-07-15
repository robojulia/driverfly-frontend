export interface BaseFormProps<T> {
    entity?: T;
    className?: string;
    onSaveComplete?: (e: T) => void;
    setEntity?: (e: T) => void;
    onSaveError?: (e?: Error) => void;
}
