import { FileScanner } from "./file_scanner";
import { MetadataReader } from "./metadata_reader";
import { PlaylistManager } from "./playlist_manager";
import { AudioPlayer } from "./audio_player";

async function main() {
  console.log("🎵 Music Player Test\n");

  console.log("📁 Scanning for audio files...");
  const scanner = new FileScanner();

  const musicFolder = "./__tests__/test_music";
  const files = await scanner.scanDirectory(musicFolder);

  console.log(`✓ Found ${files.length} audio files\n`);

  if (files.length === 0) {
    console.log("❌ No audio files found. Check your music folder path!");
    return;
  }

  console.log("📖 Reading metadata...");
  const reader = new MetadataReader();
  const tracks = await reader.readMultipleMetadata(files);

  console.log(`✓ Loaded ${tracks.length} tracks\n`);

  console.log("📋 Creating playlist...");
  const playlist = new PlaylistManager(tracks);

  console.log(`✓ Playlist ready with ${playlist.getTrackCount()} tracks\n`);

  console.log("🎼 First 3 tracks:");
  for (let i = 0; i < Math.min(3, tracks.length); i++) {
    const track = tracks[i];
    console.log(`  ${i + 1}. ${track.title} - ${track.artist}`);
  }
  console.log();

  const player = new AudioPlayer();
  const firstTrack = playlist.getCurrentTrack();

  if (firstTrack) {
    console.log(`▶️  Playing: ${firstTrack.title} by ${firstTrack.artist}`);
    await player.play(firstTrack.path);

    console.log("\n⏳ Waiting 10 seconds, then playing next track...");
    await sleep(10000);

    player.stop();
    console.log("⏹️  Stopped first track\n");

    const nextTrack = playlist.nextTrack();
    if (nextTrack) {
      console.log(
        `▶️  Playing next: ${nextTrack.title} by ${nextTrack.artist}`
      );
      await player.play(nextTrack.path);

      await sleep(10000);
      player.stop();
    }
  }

  console.log("\n✅ Test complete!");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch(console.error);
