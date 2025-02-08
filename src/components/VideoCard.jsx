import React from 'react';

export default function VideoCard({ video, onVideoClick }) {
    return (
        <button 
            onClick={() => onVideoClick(video.id?.videoId)}
            className="w-full text-left hover:transform hover:scale-105 transition-all duration-200"
        >
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl">
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
            </div>
        </button>
    );
}