import React from "react";
import { Box, Text } from "ink";
import Gradient from "ink-gradient";
import { Track } from "../../types.js";
import { MetadataReader } from "../../metadata_reader.js";

interface PlayerInfoProps {
  player: {
    currentTrack: Track | null;
    isPlaying: boolean;
    totalTracks: number;
  };
}

export function PlayerInfo({ player }: PlayerInfoProps) {
  const { currentTrack } = player;
  const reader = new MetadataReader();

  if (!currentTrack) {
    return (
      <Box
        justifyContent="center"
        alignItems="center"
        borderStyle="round"
        borderColor="red"
        paddingX={3}
        paddingY={2}
      >
        <Text color="red" bold>
          ♪ No track loaded ♪
        </Text>
      </Box>
    );
  }

  const duration = reader.formatDuration(currentTrack.duration);

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="magenta"
      paddingX={3}
      paddingY={1}
    >
      {/* Title - Using Gradient for emphasis */}
      <Box marginBottom={1}>
        <Gradient name="cristal">
          <Text bold>♫ {currentTrack.title} ♫</Text>
        </Gradient>
      </Box>

      {/* Artist */}
      <Box marginBottom={0}>
        <Box width={12}>
          <Text bold color="cyan">
            🎤 Artist:
          </Text>
        </Box>
        <Box>
          <Text color="white">{currentTrack.artist}</Text>
        </Box>
      </Box>

      {/* Album */}
      <Box marginBottom={0}>
        <Box width={12}>
          <Text bold color="magenta">
            💿 Album:
          </Text>
        </Box>
        <Box>
          <Text color="white">{currentTrack.album}</Text>
        </Box>
      </Box>

      {/* Year & Duration */}
      <Box>
        <Box width={12}>
          <Text bold color="yellow">
            📅 Year:
          </Text>
        </Box>
        <Box marginRight={3}>
          <Text color="white">{currentTrack.year || "N/A"}</Text>
        </Box>
        <Box width={12}>
          <Text bold color="green">
            ⏱️ Time:
          </Text>
        </Box>
        <Box>
          <Text color="white">{duration}</Text>
        </Box>
      </Box>
    </Box>
  );
}
