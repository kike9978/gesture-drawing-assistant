import React, { useState, useEffect, useCallback } from 'react';

// Custom debounce function
function useDebounce(callback, delay) {
    const timeoutRef = React.useRef(null);

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return useCallback((...args) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);
}

function SearchForm({ onSearch, onVideoSelect, initialQuery = '' }) {
    // Initialize with empty string if initialQuery is null or undefined
    const [searchQuery, setSearchQuery] = useState(initialQuery || '');
    const [videoUrl, setVideoUrl] = useState('');
    const [urlError, setUrlError] = useState('');

    // Debounced search function
    const debouncedSearch = useDebounce((query) => {
        if (query.trim().length >= 3) {
            onSearch(query);
        }
    }, 500);

    // Update search query when initialQuery changes, ensuring it's never null
    useEffect(() => {
        setSearchQuery(initialQuery || '');
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

    const handleSearchChange = (e) => {
        const query = e.target.value || ''; // Ensure empty string if value is null
        setSearchQuery(query);
        onSearch(query);
    };

    const handleVideoUrl = (e) => {
        e.preventDefault();
        setUrlError('');
        
        if (videoUrl.trim()) {
            const videoId = extractVideoId(videoUrl);
            if (videoId) {
                onVideoSelect(videoId);
                setVideoUrl(''); // Clear URL input after successful submission
            } else {
                setUrlError('Invalid YouTube URL format');
            }
        }
    };

    const handleUrlChange = (e) => {
        const url = e.target.value;
        setVideoUrl(url);
        setUrlError('');
        
        // If URL is valid, update immediately
        if (url.trim()) {
            const videoId = extractVideoId(url);
            if (videoId) {
                onVideoSelect(videoId);
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
                        value={searchQuery || ''} // Ensure value is never null
                        onChange={handleSearchChange}
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
                        onChange={handleUrlChange}
                        placeholder="Paste YouTube URL..."
                        className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                            urlError ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        Open
                    </button>
                </form>
                {urlError ? (
                    <p className="text-sm text-red-600">{urlError}</p>
                ) : (
                    <p className="text-sm text-gray-600">
                        Supported formats: youtube.com/watch?v=... or youtu.be/...
                    </p>
                )}
            </div>
        </div>
    );
}

export default SearchForm;
