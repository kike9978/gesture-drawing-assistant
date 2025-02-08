import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import VideoList from './components/VideoList';
import YoutubePlayer from './components/YoutubePlayer';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const RESULTS_PER_PAGE = 10;

function App() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Get video ID and search query from URL
  const selectedVideoId = searchParams.get('v');
  const searchQuery = searchParams.get('search');

  const fetchVideos = useCallback(async (query, pageToken = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${API_KEY}&maxResults=${RESULTS_PER_PAGE}&videoEmbeddable=true&type=video${pageToken ? `&pageToken=${pageToken}` : ''}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      
      const data = await response.json();
      
      // Filter out any items that don't have a valid videoId
      const filteredItems = data.items.filter(item => 
        item.id?.videoId && 
        item.snippet?.title && 
        item.snippet?.thumbnails?.high?.url
      );
      
      return {
        ...data,
        items: filteredItems
      };
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async (query) => {
    navigate(`/?search=${encodeURIComponent(query)}`);
    const data = await fetchVideos(query);
    if (data) {
      setVideos(data.items);
      setNextPageToken(data.nextPageToken);
    }
  }, [navigate, fetchVideos]);

  const handleLoadMore = useCallback(async () => {
    if (!searchQuery || !nextPageToken) return;
    
    const data = await fetchVideos(searchQuery, nextPageToken);
    if (data) {
      setVideos(prevVideos => [...prevVideos, ...data.items]);
      setNextPageToken(data.nextPageToken);
    }
  }, [searchQuery, nextPageToken, fetchVideos]);

  const handleVideoClick = useCallback((videoId) => {
    // Update URL with video ID while preserving search query
    navigate(`/?v=${videoId}${searchQuery ? `&search=${searchQuery}` : ''}`);
  }, [navigate, searchQuery]);

  const handleBackClick = useCallback(() => {
    // Go back to search results while preserving search query
    navigate(searchQuery ? `/?search=${searchQuery}` : '/');
  }, [navigate, searchQuery]);

  // Load initial search results if search query is present in URL
  useEffect(() => {
    if (searchQuery && videos.length === 0) {
      handleSearch(searchQuery);
    }
  }, [searchQuery, handleSearch, videos.length]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          YouTube Search
        </h1>
        
        <div className="max-w-2xl mx-auto mb-8">
          <SearchForm onSearch={handleSearch} initialQuery={searchQuery} />
        </div>

        {isLoading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {selectedVideoId ? (
            <div className="mb-12 bg-white rounded-lg shadow-lg p-6 max-w-5xl mx-auto h-auto">
              <button
                onClick={handleBackClick}
                className="mb-4 px-4 py-2 flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
                Back to Search Results
              </button>
              <YoutubePlayer videoId={selectedVideoId} />
            </div>
          ) : (
            videos.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Search Results
                </h2>
                <VideoList videos={videos} onVideoClick={handleVideoClick} />
                
                {nextPageToken && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Loading...' : 'Load More Results'}
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;