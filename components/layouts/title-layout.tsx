import Head from 'next/head';
import { useTranslation } from '../../hooks/use-translation';

export interface TitleLayoutProps {
    title?: string;
    readonly children?: React.ReactNode;
}

// Sets the document title for pages that render without PublicLayout/FullLayout.
export function TitleLayout({ children, title }: TitleLayoutProps) {
    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>{title ? `Driverfly | ${t(title)}` : 'Driverfly'}</title>
            </Head>
            {children}
        </>
    );
}
