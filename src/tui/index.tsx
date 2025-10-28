import React from "react";
import { render, Text, Box } from "ink";
import Spinner from "ink-spinner";
import { FileScanner } from "../file_scanner.js";
import { MetadataReader } from "../metadata_reader.js";
import { PlaylistManager } from "../playlist_manager.js";
import App from "./App.js";

async function boot() {
  // Show loading indicator
  const { clear } = render(
    <Box flexDirection="column" alignItems="center" justifyContent="center">
      <Text color="cyan">
        <Spinner type="dots" /> Scanning music library...
      </Text>
    </Box>
  );

  try {
    const scanner = new FileScanner();
    const reader = new MetadataReader();
    const musicFolder = "./src/__tests__/test_music";

    const files = await scanner.scanDirectory(musicFolder);

    if (files.length === 0) {
      clear();
      console.error("❌ No audio files found in", musicFolder);
      process.exit(1);
    }

    const tracks = await reader.readMultipleMetadata(files);

    if (tracks.length === 0) {
      clear();
      console.error("❌ No valid tracks with metadata found");
      process.exit(1);
    }

    const playlist = new PlaylistManager(tracks);

    // Clear loading screen and show app
    clear();
    render(<App playlist={playlist} />);
  } catch (error) {
    console.error("Failed to start music player:", error);
    process.exit(1);
  }
}

boot();
