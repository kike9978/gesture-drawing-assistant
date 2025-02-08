import React from 'react';
import VideoCard from './VideoCard';

export default function VideoList({ videos, onVideoClick }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
                <VideoCard 
                    key={video.id?.videoId || video.etag || `video-${index}`}
                    video={video} 
                    onVideoClick={onVideoClick} 
                />
            ))}
        </div>
    );
}
