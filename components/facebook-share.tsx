import React from 'react';

const SocialShareButton = ({ postUrl }) => {
    const handleClick = () => {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`;
        window.open(shareUrl, '_blank');
    };

    return (
        <button onClick={handleClick} className="theme-secondary-btn w-75 p-4">
            Share on your Facebook page
        </button>
    );
};

export default SocialShareButton;