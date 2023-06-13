import React, { useEffect } from 'react';
import { useTranslation } from '../hooks/use-translation';

const FacebookShare = ({ jobUrl }) => {
    
    const { t } = useTranslation();

    const handleClick = () => {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${jobUrl}`;
        window.open(shareUrl, '_blank');
    };

    return (
        <button onClick={handleClick} className="theme-secondary-btn w-100 p-4">{t("SHARE_ON_YOUR_COMPANY_FACEBOOK_PAGE")}</button>
    );
};

export default FacebookShare;