import React from 'react';

const PinnedVideosSidebar = ({ 
    isOpen, 
    onToggle, 
    pinnedVideos, 
    onVideoSelect, 
    onRemovePin,
    currentVideoId 
}) => {
    return (
        <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 ${
            isOpen ? 'w-80' : 'w-12'
        }`}>
            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-8 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-gray-600 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {/* Content */}
            {isOpen && (
                <div className="h-full p-4 overflow-y-auto">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Pinned Videos</h2>
                    <div className="space-y-4">
                        {pinnedVideos.map((video) => (
                            <div
                                key={video.videoId}
                                className={`p-3 rounded-lg border ${
                                    currentVideoId === video.videoId
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300'
                                }`}
                            >
                                <div className="flex justify-between items-start gap-2 mb-2">
                                    <button
                                        onClick={() => onVideoSelect(video)}
                                        className="flex-1 text-left text-sm font-medium text-gray-800 hover:text-blue-600"
                                    >
                                        <div className="font-medium">
                                            {video.title || `Video ${video.videoId}`}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            <div>Pause after: {video.pauseDuration}s</div>
                                            <div>Resume after: {video.resumeDelay}s</div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => onRemovePin(video.videoId)}
                                        className="text-gray-400 hover:text-red-500 flex-shrink-0"
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
                                    </button>
                                </div>
                            </div>
                        ))}
                        {pinnedVideos.length === 0 && (
                            <p className="text-sm text-gray-500 text-center">
                                No pinned videos yet
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PinnedVideosSidebar; 