import React from 'react';

function VideoListItem({ video, onVideoClick }) {
  return (
    <div 
      onClick={() => onVideoClick(video.id?.videoId)}
      className="cursor-pointer group hover:transform hover:scale-105 transition-all duration-200"
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
        <img 
          src={video.snippet.thumbnails.high.url} 
          alt={video.snippet.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-gray-800 font-semibold line-clamp-2 group-hover:text-blue-500 transition-colors">
            {video.snippet.title}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default function VideoList({ videos, onVideoClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video, index) => (
        <VideoListItem 
          key={video.id?.videoId || video.etag || `video-${index}`}
          video={video} 
          onVideoClick={onVideoClick} 
        />
      ))}
    </div>
  );
}
