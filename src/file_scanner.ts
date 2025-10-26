import { promises as fsPromises } from "fs";
import * as path from "path";

export class FileScanner {
  private readonly audioExtentions = [".mp3", ".wav", ".flac", ".m4a", ".ogg"];
  public async scanDirectory(dirPath: string): Promise<string[]> {
    const audioFiles: string[] = [];
    await this.recursiveScan(dirPath, audioFiles);
    return audioFiles;
  }

  private async recursiveScan(
    currentPath: string,
    fileList: string[]
  ): Promise<void> {
    try {
      const entries = await fsPromises.readdir(currentPath, {
        withFileTypes: true,
      });

      await Promise.all(
        entries.map(async (entry) => {
          const fullPath = path.join(currentPath, entry.name);

          if (entry.isDirectory()) {
            await this.recursiveScan(fullPath, fileList);
          } else if (entry.isFile()) {
            const ext = path.extname(fullPath).toLowerCase();
            if (this.audioExtentions.includes(ext)) {
              fileList.push(fullPath);
            }
          }
        })
      );
    } catch (error) {
      console.error(`Error scanning directory ${currentPath}:`, error);
    }
  }
}
