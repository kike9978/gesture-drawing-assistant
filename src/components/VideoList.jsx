import React from 'react';

function VideoListItem({ video, onVideoClick }) {

    return (
        <li key={video.id.videoId} onClick={() => onVideoClick(video.id.videoId)} className='cursor-pointer'>

            <img src={video.snippet.thumbnails.high.url} alt={video.snippet.title} />
            <h3>{video.snippet.title}</h3>

        </li>
    );
}

export default function VideoList({ videos, onVideoClick }) {

    return (
        <ul className='grid grid-cols-4 gap-4 text-start'>
            {videos.map((video) => (
                <VideoListItem key={video.id.videoId} video={video} onVideoClick={onVideoClick} />
            ))}
        </ul>
    );

}
