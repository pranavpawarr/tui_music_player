import React from "react";
import { Box, Text } from "ink";
import { Track } from "../../types.js";

interface TrackListProps {
  tracks: Track[];
  currentTrackId: string | null;
}

export function TrackList({ tracks, currentTrackId }: TrackListProps) {
  const displayTracks = tracks.slice(0, 10);

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="blue"
      padding={1}
    >
      <Box marginBottom={1}>
        <Text bold color="cyan">
          📋 Playlist
        </Text>
      </Box>

      {displayTracks.map((track, index) => {
        const isCurrentTrack = track.id === currentTrackId;

        return (
          <Box key={track.id}>
            <Text color={isCurrentTrack ? "green" : "white"}>
              {isCurrentTrack ? "▶ " : `${index + 1}. `}
              {track.title} - {track.artist}
            </Text>
          </Box>
        );
      })}

      {tracks.length > 10 && (
        <Box marginTop={1}>
          <Text dimColor>... and {tracks.length - 10} more tracks</Text>
        </Box>
      )}
    </Box>
  );
}
