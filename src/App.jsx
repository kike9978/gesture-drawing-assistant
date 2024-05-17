import './App.css'
import VideoCard from './components/VideoCard'

import React, { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import VideoList from './components/VideoList';
import VideoPlayer from './components/VideoPlayer';
import YoutubePlayer from './components/YoutubePlayer';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY; // Replace with your actual API key


function App() {
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  const handleSearch = async (query) => {
    setSelectedVideoId(null)
    const response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${API_KEY}&maxResults=10`)

    const data = await response.json();
    setVideos(data.items)
  };

  function handleVideoClick(videoId) {

    setSelectedVideoId(videoId);
  }




  return (
    <div className="App">

      <h1>YouTube Search</h1>
      <SearchForm onSearch={handleSearch} />

      {selectedVideoId ? <YoutubePlayer videoId={selectedVideoId} /> :
        videos.length > 0 && (
          <>
            <h2>Search Results</h2>
            <VideoList videos={videos} onVideoClick={handleVideoClick} />
          </>
        )
      }
    </div>
  );
}

export default App
