import React, { useState, useEffect } from 'react';

function SearchForm({ onSearch, onVideoSelect, initialQuery = '' }) {
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [videoUrl, setVideoUrl] = useState('');

    // Update search query when initialQuery changes
    useEffect(() => {
        setSearchQuery(initialQuery);
    }, [initialQuery]);

    const extractVideoId = (url) => {
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname.includes('youtube.com')) {
                return urlObj.searchParams.get('v');
            } else if (urlObj.hostname.includes('youtu.be')) {
                return urlObj.pathname.slice(1);
            }
        } catch (e) {
            return null;
        }
        return null;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery);
        }
    };

    const handleVideoUrl = (e) => {
        e.preventDefault();
        if (videoUrl.trim()) {
            const videoId = extractVideoId(videoUrl);
            if (videoId) {
                onVideoSelect(videoId);
                setVideoUrl(''); // Clear URL input after successful submission
            }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search Videos Form */}
            <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-700">Search Videos</h2>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for videos..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Direct Video URL Form */}
            <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-700">Open Video URL</h2>
                <form onSubmit={handleVideoUrl} className="flex gap-2">
                    <input
                        type="text"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="Paste YouTube URL..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        Open
                    </button>
                </form>
                <p className="text-sm text-gray-600">
                    Supported formats: youtube.com/watch?v=... or youtu.be/...
                </p>
            </div>
        </div>
    );
}

export default SearchForm;
