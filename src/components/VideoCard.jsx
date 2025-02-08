import React from 'react';
import Card from './ui/Card';

const VideoCard = ({ video, onVideoClick }) => {
    return (
        <Card 
            onClick={() => onVideoClick(video.id?.videoId)}
            hover
            className="w-full cursor-pointer"
        >
            <img 
                src={video.snippet.thumbnails.high.url} 
                alt={video.snippet.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-gray-800 font-semibold line-clamp-2">
                    {video.snippet.title}
                </h3>
            </div>
        </Card>
    );
};

export default VideoCard;