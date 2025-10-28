import React from "react";
import { Box, Text } from "ink";
import Gradient from "ink-gradient";
import { PlaylistManager } from "../../playlist_manager.js";
import { Track } from "../../types.js";
import { MetadataReader } from "../../metadata_reader.js";

interface QueueViewProps {
  playlist: PlaylistManager;
  currentTrack: Track | null;
}

export function QueueView({ playlist, currentTrack }: QueueViewProps) {
  const reader = new MetadataReader();

  // Get all tracks from playlist
  const tracks = getAllTracks(playlist);
  const maxDisplay = 15; // Show max 15 tracks

  return (
    <Box
      flexDirection="column"
      borderStyle="bold"
      borderColor="blue"
      paddingX={2}
      paddingY={1}
    >
      {/* Header */}
      <Box justifyContent="center" marginBottom={1}>
        <Gradient name="vice">
          <Text bold>🎵 QUEUE ({tracks.length} tracks)</Text>
        </Gradient>
      </Box>

      {/* Track List */}
      <Box flexDirection="column">
        {tracks.slice(0, maxDisplay).map((track, index) => {
          const isCurrent = currentTrack?.id === track.id;
          const duration = reader.formatDuration(track.duration);

          return (
            <Box key={track.id} marginBottom={0}>
              {isCurrent ? (
                <Box flexDirection="row">
                  <Text color="green" bold>
                    ▶ {track.title.substring(0, 25)}
                    {track.title.length > 25 ? "..." : ""}
                  </Text>
                  <Text color="green" dimColor>
                    {" "}
                    [{duration}]
                  </Text>
                </Box>
              ) : (
                <Box flexDirection="row">
                  <Text dimColor>{String(index + 1).padStart(2, "0")}</Text>
                  <Text color="white">
                    {" "}
                    {track.title.substring(0, 25)}
                    {track.title.length > 25 ? "..." : ""}
                  </Text>
                  <Text dimColor> [{duration}]</Text>
                </Box>
              )}
            </Box>
          );
        })}

        {tracks.length > maxDisplay && (
          <Box marginTop={1}>
            <Text dimColor>... and {tracks.length - maxDisplay} more</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// Helper function to get all tracks
function getAllTracks(playlist: PlaylistManager): Track[] {
  // If you added getTracks() method to PlaylistManager, use it:
  // return playlist.getTracks();

  // Otherwise, temporary workaround:
  return (playlist as any).listOfTracks || [];
}
