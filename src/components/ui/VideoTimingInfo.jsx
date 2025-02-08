import React from 'react';
import Text from './Text';
import Stack from './Stack';

const VideoTimingInfo = ({ 
  pauseDuration = 0.5,
  resumeDelay = 10,
  className = ''
}) => {
  return (
    <Stack gap={1} className={className}>
      <Text size="xs" color="gray">
        Pause after: {pauseDuration}s
      </Text>
      <Text size="xs" color="gray">
        Resume after: {resumeDelay}s
      </Text>
    </Stack>
  );
};

export default VideoTimingInfo; 