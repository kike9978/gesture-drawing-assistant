import React from 'react';
import VideoCard from './VideoCard';
import Grid from './ui/Grid';
import Section from './ui/Section';
import Heading from './ui/Heading';

const VideoList = ({ videos, onVideoClick }) => {
    return (
        <Section className="max-w-7xl mx-auto">
            <Heading level={2} className="mb-6">
                Search Results
            </Heading>
            <Grid cols={3}>
                {videos.map((video, index) => (
                    <VideoCard 
                        key={video.id?.videoId || video.etag || `video-${index}`}
                        video={video} 
                        onVideoClick={onVideoClick} 
                    />
                ))}
            </Grid>
        </Section>
    );
};

export default VideoList;
