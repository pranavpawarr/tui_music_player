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

interface AppProps {
  playlist: PlaylistManager;
}

export default function App({ playlist }: AppProps) {
  const { exit } = useApp();
  const player = usePlayer(playlist);
  const [showHelp, setShowHelp] = useState(true);
  const [showQueue, setShowQueue] = useState(false);

  useInput((input, key) => {
    // Quit
    if (input === "q" || input === "Q") {
      player.stop();
      exit();
    }

    // Toggle help
    if (input === "h" || input === "H") {
      setShowHelp(!showHelp);
    }

    // Toggle queue view
    if (input === "l" || input === "L") {
      setShowQueue(!showQueue);
    }

    // Play/Pause
    if (input === " ") {
      player.togglePlayPause();
    }

    // Next track
    if (key.rightArrow || input === "n") {
      player.next();
    }

    // Previous track
    if (key.leftArrow || input === "p") {
      player.previous();
    }

    // Restart track
    if (input === "r") {
      player.restart();
    }

    // Volume controls
    if (key.upArrow || input === "+" || input === "=") {
      player.increaseVolume();
    }

    if (key.downArrow || input === "-" || input === "_") {
      player.decreaseVolume();
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      {/* Animated Title */}
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
        {/* Player Status Bar */}
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

        {/* Two Column Layout: Player Info + Queue */}
        <Box>
          {/* Left Column: Player Info */}
          <Box flexDirection="column" flexGrow={1} marginRight={2}>
            <PlayerInfo player={player} />

            {/* Volume Bar */}
            <Box marginY={1}>
              <VolumeBar volume={player.volume} />
            </Box>
          </Box>

          {/* Right Column: Queue (if enabled) */}
          {showQueue && (
            <Box width={45}>
              <QueueView
                playlist={playlist}
                currentTrack={player.currentTrack}
              />
            </Box>
          )}
        </Box>

        {/* Divider with gradient */}
        <Box marginY={1}>
          <Gradient name="passion">
            <Text>{"═".repeat(showQueue ? 120 : 80)}</Text>
          </Gradient>
        </Box>

        {/* Controls Help (toggleable) */}
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
