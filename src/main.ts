import { FileScanner } from "./file_scanner";
import { MetadataReader } from "./metadata_reader";
import { PlaylistManager } from "./playlist_manager";
import { AudioPlayer } from "./audio_player";

async function main() {
  console.log("🎵 Music Player Test\n");

  console.log("📁 Scanning for audio files...");
  const scanner = new FileScanner();

  const musicFolder = "./src/__tests__/test_music";
  const files = await scanner.scanDirectory(musicFolder);

  console.log(`✓ Found ${files.length} audio files\n`);

  if (files.length === 0) {
    console.log("❌ No audio files found!");
    return;
  }

  console.log("📖 Reading metadata...");
  const reader = new MetadataReader();
  const tracks = await reader.readMultipleMetadata(files);

  console.log(`✓ Loaded ${tracks.length} tracks\n`);

  console.log("📋 Creating playlist...");
  const playlist = new PlaylistManager(tracks);

  console.log(`✓ Playlist ready with ${playlist.getTrackCount()} tracks\n`);

  console.log("🎼 All tracks:");
  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    console.log(
      `  ${i + 1}. ${track.title} - ${track.artist} (${reader.formatDuration(
        track.duration
      )})`
    );
  }
  console.log();

  const player = new AudioPlayer();

  // Play Track 1
  const track1 = playlist.getCurrentTrack();
  if (track1) {
    console.log(`\n▶️  Playing: ${track1.title}`);
    player.play(track1.path);

    console.log("⏳ Playing for 5 seconds...");
    await sleep(5000);

    player.stop();
    console.log("⏹️  Stopped\n");
    await sleep(500); // Small delay to ensure clean stop
  }

  // Play Track 2
  const track2 = playlist.nextTrack();
  if (track2) {
    console.log(`▶️  Playing: ${track2.title}`);
    player.play(track2.path);

    console.log("⏳ Playing for 5 seconds...");
    await sleep(5000);

    player.stop();
    console.log("⏹️  Stopped\n");
    await sleep(500); // Small delay
  }

  // Play Track 3
  const track3 = playlist.nextTrack();
  if (track3) {
    console.log(`▶️  Playing: ${track3.title}`);
    player.play(track3.path);

    console.log("⏳ Playing for 5 seconds...");
    await sleep(5000);

    player.stop();
    console.log("⏹️  Stopped\n");
  }

  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

main().catch(console.error);
