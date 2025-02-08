import React from 'react';
import Card from './Card';
import IconButton from './IconButton';
import VideoTimingInfo from './VideoTimingInfo';

const PinnedVideoCard = ({ 
  video, 
  isActive, 
  onSelect, 
  onRemove,
}) => {
  return (
    <Card
      className={`p-3 border ${
        isActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-blue-300'
      }`}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <button
          onClick={() => onSelect(video)}
          className="flex-1 text-left text-sm font-medium text-gray-800 hover:text-blue-600"
        >
          <div className="font-medium">
            {video.title || `Video ${video.videoId}`}
          </div>
          <VideoTimingInfo 
            pauseDuration={video.pauseDuration || 0.5}
            resumeDelay={video.resumeDelay || 10}
            className="mt-1"
          />
        </button>
        <IconButton
          onClick={() => onRemove(video.videoId)}
          variant="danger"
          aria-label="Remove video"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </IconButton>
      </div>
    </Card>
  );
};

export default PinnedVideoCard; 