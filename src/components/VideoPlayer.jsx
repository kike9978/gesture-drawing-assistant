import React from 'react';

export default function VideoPlayer({ videoId }) {

    return (
        <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="no-referrer" // For security, set referrerpolicy to "no-referrer"
        ></iframe>
    );

}
