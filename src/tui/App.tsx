import React, { useState } from "react";
import { Box, Text, useInput, useApp } from "ink";
import Gradient from "ink-gradient";
import BigText from "ink-big-text";
import { PlaylistManager } from "../playlist_manager.js";
import { usePlayer } from "./hooks/usePlayer.js";
import { PlayerInfo } from "./components/PlayerInfo.js";
import { Controls } from "./components/Controls.js";
import { VolumeBar } from "./components/VolumeBar.js";
import { QueueView } from "./components/QueueView.js";
import { DancingCat } from "./components/DancingCat.js";

interface AppProps {
  playlist: PlaylistManager;
}

export default function App({ playlist }: AppProps) {
  const { exit } = useApp();
  const player = usePlayer(playlist);
  const [showHelp, setShowHelp] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  useInput((input, key) => {
    if (input === "q" || input === "Q") {
      player.stop();
      exit();
    }
    if (input === "h" || input === "H") {
      setShowHelp(!showHelp);
    }
    if (input === "l" || input === "L") {
      setShowQueue(!showQueue);
    }
    if (input === " ") {
      player.togglePlayPause();
    }
    if (key.rightArrow || input === "n") {
      player.next();
    }
    if (key.leftArrow || input === "p") {
      player.previous();
    }
    if (input === "r") {
      player.restart();
    }
    if (key.upArrow || input === "+" || input === "=") {
      player.increaseVolume();
    }
    if (key.downArrow || input === "-" || input === "_") {
      player.decreaseVolume();
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      {/* Title */}
      <Box justifyContent="center" marginBottom={1}>
        <Gradient name="rainbow">
          <BigText text="Music" font="chrome" />
        </Gradient>
      </Box>

      {/* Main Container */}
      <Box
        flexDirection="column"
        borderStyle="double"
        borderColor="cyan"
        paddingX={2}
        paddingY={1}
      >
        {/* Status Bar */}
        <Box
          justifyContent="space-between"
          borderStyle="round"
          borderColor={player.isPlaying ? "green" : "yellow"}
          paddingX={2}
          paddingY={0}
          marginBottom={1}
        >
          <Box>
            <Text bold color={player.isPlaying ? "green" : "yellow"}>
              {player.isPlaying ? "▶️  PLAYING" : "⏸️  PAUSED"}
            </Text>
          </Box>
          <Box>
            <Text dimColor>
              Track {player.currentIndex + 1} of {player.totalTracks}
            </Text>
          </Box>
        </Box>

        {/* Main Content Row */}
        <Box marginBottom={1}>
          {/* Dancing Cat */}
          <DancingCat isPlaying={player.isPlaying} />

          {/* Track Info */}
          <Box flexGrow={1} marginLeft={2}>
            <PlayerInfo player={player} />
          </Box>
        </Box>

        {/* Volume Bar */}
        <Box marginY={1}>
          <VolumeBar volume={player.volume} />
        </Box>

        {/* Queue (if enabled) */}
        {showQueue && (
          <Box marginY={1}>
            <QueueView playlist={playlist} currentTrack={player.currentTrack} />
          </Box>
        )}

        {/* Divider */}
        <Box marginY={1}>
          <Gradient name="passion">
            <Text>{"═".repeat(80)}</Text>
          </Gradient>
        </Box>

        {/* Controls (if enabled) */}
        {showHelp && <Controls />}

        {/* Footer */}
        <Box justifyContent="center" marginTop={1}>
          <Text dimColor>
            Press{" "}
            <Text color="cyan" bold>
              H
            </Text>{" "}
            to {showHelp ? "hide" : "show"} controls •{" "}
            <Text color="magenta" bold>
              L
            </Text>{" "}
            to {showQueue ? "hide" : "show"} queue •{" "}
            <Text color="red" bold>
              Q
            </Text>{" "}
            to quit
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
