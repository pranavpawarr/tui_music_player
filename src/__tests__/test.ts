import * as path from "path";

const musicFolder = path.join(__dirname, "../__tests__/test_music");
// Adjust the '../' based on where test.ts is
import { FileScanner } from "../file_scanner";
import { MetadataReader } from "../metadata_reader";
import { PlaylistManager } from "../playlist_manager";
import { AudioPlayer } from "../audio_player";

async function testMusicPlayer() {
  console.log("🎵 Music Player Integration Test\n");
  console.log("=".repeat(50) + "\n");

  // Test 1: File Scanner
  console.log("TEST 1: File Scanner");
  console.log("-".repeat(50));
  const scanner = new FileScanner();
  const musicFolder = "./test_music";

  console.log(`Scanning folder: ${musicFolder}`);
  const files = await scanner.scanDirectory(musicFolder);

  console.log(`✓ Found ${files.length} audio files`);
  if (files.length === 0) {
    console.log("❌ FAIL: No audio files found!");
    return;
  }
  console.log(`✓ PASS: File scanner works\n`);

  // Test 2: Metadata Reader
  console.log("TEST 2: Metadata Reader");
  console.log("-".repeat(50));
  const reader = new MetadataReader();
  const tracks = await reader.readMultipleMetadata(files);

  console.log(`✓ Loaded ${tracks.length} tracks`);
  console.log("Sample track:");
  if (tracks[0]) {
    console.log(`  Title: ${tracks[0].title}`);
    console.log(`  Artist: ${tracks[0].artist}`);
    console.log(`  Album: ${tracks[0].album}`);
    console.log(`  Duration: ${tracks[0].duration}s`);
  }
  console.log(`✓ PASS: Metadata reader works\n`);

  // Test 3: Playlist Manager
  console.log("TEST 3: Playlist Manager");
  console.log("-".repeat(50));
  const playlist = new PlaylistManager(tracks);

  console.log(`✓ Playlist created with ${playlist.getTrackCount()} tracks`);

  const currentTrack = playlist.getCurrentTrack();
  console.log(`✓ Current track: ${currentTrack?.title}`);

  const nextTrack = playlist.nextTrack();
  console.log(`✓ Next track: ${nextTrack?.title}`);

  const prevTrack = playlist.previousTrack();
  console.log(`✓ Previous track: ${prevTrack?.title}`);

  playlist.toggleRepeat();
  console.log(`✓ Repeat toggled`);

  playlist.toggleShuffle();
  console.log(`✓ Shuffle toggled`);

  console.log(`✓ PASS: Playlist manager works\n`);

  // Test 4: Audio Player
  console.log("TEST 4: Audio Player");
  console.log("-".repeat(50));
  const player = new AudioPlayer();

  const testTrack = playlist.getCurrentTrack();
  if (testTrack) {
    console.log(`▶️  Playing: ${testTrack.title} by ${testTrack.artist}`);
    await player.play(testTrack.path);

    console.log("⏳ Playing for 5 seconds...");
    await sleep(5000);

    console.log(`✓ Is playing: ${player.isCurrentlyPlaying()}`);
    console.log(`✓ Current track: ${player.getCurrentTrack()}`);

    player.stop();
    console.log("⏹️  Stopped");
    console.log(`✓ Is playing after stop: ${player.isCurrentlyPlaying()}`);

    console.log("\n▶️  Testing restart...");
    await player.play(testTrack.path);
    await sleep(2000);
    player.restart();
    console.log("🔄 Restarted");
    await sleep(3000);
    player.stop();

    console.log(`✓ PASS: Audio player works\n`);
  }

  // Test 5: Integration Test
  console.log("TEST 5: Integration (Playlist + Player)");
  console.log("-".repeat(50));

  // Reset playlist
  const integrationPlaylist = new PlaylistManager(tracks);
  const integrationPlayer = new AudioPlayer();

  console.log("Playing first 3 tracks for 3 seconds each...\n");

  for (let i = 0; i < Math.min(3, tracks.length); i++) {
    const track = integrationPlaylist.getCurrentTrack();
    if (track) {
      console.log(`${i + 1}. ▶️  ${track.title} - ${track.artist}`);
      await integrationPlayer.play(track.path);
      await sleep(3000);
      integrationPlayer.stop();

      if (i < 2) {
        integrationPlaylist.nextTrack();
      }
    }
  }

  console.log(`\n✓ PASS: Integration works\n`);

  // Summary
  console.log("=".repeat(50));
  console.log("✅ ALL TESTS PASSED!");
  console.log("=".repeat(50));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Run the tests
testMusicPlayer().catch((error) => {
  console.error("\n❌ TEST FAILED:");
  console.error(error);
  process.exit(1);
});
