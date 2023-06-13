
export interface LoadingProps {
    isLoading: boolean;
    className?: string;
}

export function LoaderIcon({ isLoading, className }: LoadingProps) {
    return <>
        {
            !!isLoading &&
            <span className={`spinner-grow spinner-grow-sm ${className || ""}`}></span>
        }
    </>
}

