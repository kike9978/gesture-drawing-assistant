import React, { useState, useEffect, useCallback } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';
import Card from './ui/Card';
import Grid from './ui/Grid';

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

const SearchSection = ({ title, children }) => (
    <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        {children}
    </div>
);

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
        <Grid cols={2}>
            <SearchSection title="Search Videos">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        value={searchQuery || ''}
                        onChange={handleSearchChange}
                        placeholder="Search for videos..."
                        className="flex-1"
                    />
                    <Button type="submit">
                        Search
                    </Button>
                </form>
            </SearchSection>

            <SearchSection title="Open Video URL">
                <form onSubmit={handleVideoUrl} className="flex gap-2">
                    <Input
                        value={videoUrl}
                        onChange={handleUrlChange}
                        placeholder="Paste YouTube URL..."
                        error={urlError}
                        className="flex-1"
                    />
                    <Button type="submit">
                        Open
                    </Button>
                </form>
                {urlError ? (
                    <p className="text-sm text-red-600">{urlError}</p>
                ) : (
                    <p className="text-sm text-gray-600">
                        Supported formats: youtube.com/watch?v=... or youtu.be/...
                    </p>
                )}
            </SearchSection>
        </Grid>
    );
}

export default SearchForm;
