import React from 'react';
import Sidebar from './ui/Sidebar';
import Button from './ui/Button';
import Heading from './ui/Heading';
import PinnedVideoCard from './ui/PinnedVideoCard';
import IconButton from './ui/IconButton';
import ScrollArea from './ui/ScrollArea';
import Flex from './ui/Flex';
import Stack from './ui/Stack';
import Text from './ui/Text';

const SidebarToggleButton = ({ onClick, isOpen }) => (
  <IconButton
    onClick={onClick}
    className={`absolute ${isOpen? "": "md:"}-right-3 top-8 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50`}
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
  </IconButton>
);

const PinnedVideosSidebar = ({ 
  isOpen, 
  onToggle, 
  pinnedVideos, 
  onVideoSelect, 
  onRemovePin,
  currentVideoId,
  onClearAll
}) => {
  return (
    <Sidebar isOpen={isOpen}>
      <SidebarToggleButton onClick={onToggle} isOpen={isOpen} />

      {isOpen && (
        <ScrollArea className="p-4">
          <Flex justify="between" items="center" className="mb-4">
            <Heading level={2}>Pinned Videos</Heading>
            {pinnedVideos.length > 0 && (
              <Button
                onClick={onClearAll}
                variant="danger"
                className="text-sm"
                title="Clear all pinned videos"
              >
                Clear All
              </Button>
            )}
          </Flex>

          <Stack gap={4}>
            {pinnedVideos.map((video) => (
              <PinnedVideoCard
                key={video.videoId}
                video={{
                  ...video,
                  pauseDuration: video.pauseDuration || 0.5,
                  resumeDelay: video.resumeDelay || 10
                }}
                isActive={currentVideoId === video.videoId}
                onSelect={onVideoSelect}
                onRemove={onRemovePin}
              />
            ))}
            
            {pinnedVideos.length === 0 && (
              <Text size="sm" color="gray" align="center">
                No pinned videos yet
              </Text>
            )}
          </Stack>
        </ScrollArea>
      )}
    </Sidebar>
  );
};

export default PinnedVideosSidebar; 