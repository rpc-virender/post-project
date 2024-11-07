import React from 'react';

const YouTubeEmbed = ({ url, className }) => {

  return (
    <div className="video-responsive">
      <iframe
        className={className}
        width="560"
        height="315"
        src={url}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title=""
      ></iframe>
    </div>
  );
};

export default YouTubeEmbed;
