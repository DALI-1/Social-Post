import React, { useEffect } from 'react';

const OEmbeded_FB_Post = ({ postUrl }) => {
  const encodedPostUrl = encodeURIComponent(postUrl);
  const embedUrl = `https://www.facebook.com/plugins/post.php?href=${encodedPostUrl}`;

  return (
    <iframe
  src={embedUrl}
  width="500"
  height="600"
  style={{ border: 'none', overflow: 'hidden' }}
  scrolling="no"
  frameBorder="0"
  allowFullScreen="true"
  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
></iframe>
  );
};

export default OEmbeded_FB_Post;