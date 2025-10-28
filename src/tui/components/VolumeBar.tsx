import React from "react";
import { Box, Text } from "ink";
import Gradient from "ink-gradient";

interface VolumeBarProps {
  volume: number;
}

export function VolumeBar({ volume }: VolumeBarProps) {
  const maxVolume = 50;
  const barLength = 40;
  const filledLength = Math.round((volume / maxVolume) * barLength);
  const emptyLength = barLength - filledLength;

  const filled = "█".repeat(filledLength);
  const empty = "░".repeat(emptyLength);

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="blue"
      paddingX={2}
      paddingY={0}
    >
      <Box justifyContent="space-between">
        <Text bold color="blue">
          🔊 Volume
        </Text>
        <Text bold color="white">
          {volume}/{maxVolume}
        </Text>
      </Box>
      <Box>
        <Gradient name="morning">
          <Text>{filled}</Text>
        </Gradient>
        <Text dimColor>{empty}</Text>
      </Box>
    </Box>
  );
}
