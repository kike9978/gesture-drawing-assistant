import React, { useState, useCallback } from 'react';
import SearchForm from './components/SearchForm';
import VideoList from './components/VideoList';
import YoutubePlayer from './components/YoutubePlayer';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

function App() {
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = useCallback(async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${API_KEY}&maxResults=10`);
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      const data = await response.json();
      setVideos(data.items);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleVideoClick = useCallback((videoId) => {
    setSelectedVideoId(videoId);
  }, []);

  return (
    <div className="App">
      <h1>YouTube Search</h1>
      <SearchForm onSearch={handleSearch} />
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {selectedVideoId && <YoutubePlayer videoId={selectedVideoId} />}
      {videos.length > 0 && (
        <>
          <h2>Search Results</h2>
          <VideoList videos={videos} onVideoClick={handleVideoClick} />
        </>
      )}
    </div>
  );
}

export default App;