import { MetadataReader } from "../metadata_reader";

// Don't mock music-metadata at all
jest.mock("crypto", () => ({
  randomUUID: jest.fn(() => "test-uuid-123"),
}));

describe("MetadataReader", () => {
  let reader: MetadataReader;

  beforeEach(() => {
    reader = new MetadataReader();
  });

  describe("formatDuration", () => {
    it("should format duration to MM:SS", () => {
      expect(reader.formatDuration(0)).toBe("0:00");
      expect(reader.formatDuration(45)).toBe("0:45");
      expect(reader.formatDuration(60)).toBe("1:00");
      expect(reader.formatDuration(125)).toBe("2:05");
      expect(reader.formatDuration(3661)).toBe("61:01");
    });

    it("should handle decimal seconds", () => {
      expect(reader.formatDuration(125.7)).toBe("2:05");
      expect(reader.formatDuration(59.9)).toBe("0:59");
    });

    it("should pad single digit seconds with zero", () => {
      expect(reader.formatDuration(65)).toBe("1:05");
      expect(reader.formatDuration(9)).toBe("0:09");
    });

    it("should handle large durations", () => {
      expect(reader.formatDuration(7200)).toBe("120:00");
      expect(reader.formatDuration(3599)).toBe("59:59");
    });
  });

  describe("readMultipleMetadata", () => {
    it("should handle empty file list", async () => {
      const results = await reader.readMultipleMetadata([]);
      expect(results).toEqual([]);
    });
  });
});
