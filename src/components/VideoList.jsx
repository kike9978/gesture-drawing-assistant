import React from 'react';

function VideoListItem({ video, onVideoClick }) {

    return (
        <li key={video.id.videoId} onClick={() => onVideoClick(video.id.videoId)}>

            <img src={video.snippet.thumbnails.high.url} alt={video.snippet.title} />
            <h3>{video.snippet.title}</h3>

        </li>
    );
}

export default function VideoList({ videos, onVideoClick }) {

    return (
        <ul>
            {videos.map((video) => (
                <VideoListItem key={video.id.videoId} video={video} onVideoClick={onVideoClick} />
            ))}
        </ul>
    );

}
