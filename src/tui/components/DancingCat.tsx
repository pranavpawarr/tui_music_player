import React, { useState, useEffect } from "react";
import { Box, Text } from "ink";
import Gradient from "ink-gradient";

interface DancingCatProps {
  isPlaying: boolean;
}

export function DancingCat({ isPlaying }: DancingCatProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [lightColor, setLightColor] = useState<
    "red" | "blue" | "magenta" | "yellow" | "cyan" | "green"
  >("magenta");

  const jumpFrames = [
    // Frame 1 - Standing
    `      /\\_/\\
     ( •ω• )
     (") (")
    /  |  \\
   (   |   )
   |   |   |
  ~~~~~~~~~~`,

    // Frame 2 - Crouch
    `      /\\_/\\
     ( ^ω^ )
     (") (")
    /   |   \\
   (    |    )
  ~~~~~~~~~~`,

    // Frame 3 - Jump up
    `
      /\\_/\\
     ( ◕ω◕ )
     (") (")
      \\   /
      (   )
  ~~~~~~~~~~`,

    // Frame 4 - High jump
    `

      /\\_/\\
     ( ✧ω✧ )
    _(") (")_
     \\     /
      (   )
  ~~~~~~~~~~`,

    // Frame 5 - Coming down
    `
      /\\_/\\
     ( ^ᴗ^ )
     (") (")
      /   \\
     (     )
  ~~~~~~~~~~`,

    // Frame 6 - Landing
    `      /\\_/\\
     ( ◕‿◕ )
     (") (")
    /  |  \\
   (   |   )
   |   |   |
  ~~~~~~~~~~`,
  ];

  const discoBall = `   ⣀⣤⣤⣀
  ⣼⣿⣿⣿⣧
  ⣿⣿⣿⣿⣿
  ⠹⣿⣿⣿⠏
    ⠉⠉`;

  useEffect(() => {
    if (!isPlaying) {
      setFrameIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % jumpFrames.length);
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying, jumpFrames.length]);

  useEffect(() => {
    if (!isPlaying) return;

    const lightInterval = setInterval(() => {
      const colors: Array<
        "red" | "blue" | "magenta" | "yellow" | "cyan" | "green"
      > = ["red", "blue", "magenta", "yellow", "cyan", "green"];
      setLightColor(colors[Math.floor(Math.random() * colors.length)]);
    }, 300);

    return () => clearInterval(lightInterval);
  }, [isPlaying]);

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={isPlaying ? lightColor : "gray"}
      paddingX={1}
      paddingY={1}
      alignItems="center"
      width={20}
    >
      {/* Disco Ball */}
      <Box marginBottom={1}>
        {isPlaying ? (
          <Text color={lightColor}>{discoBall}</Text>
        ) : (
          <Text dimColor>{discoBall}</Text>
        )}
      </Box>

      {/* Disco Lights */}
      {isPlaying && (
        <Box marginBottom={1}>
          <Text color={lightColor}>✨ </Text>
          <Text color={lightColor === "red" ? "cyan" : "red"}>★ </Text>
          <Text color={lightColor === "magenta" ? "green" : "magenta"}>✧</Text>
        </Box>
      )}

      {/* The Cat */}
      {isPlaying ? (
        <Box height={10}>
          <Text color="gray">{jumpFrames[frameIndex]}</Text>
        </Box>
      ) : (
        <Box height={10}>
          <Text color="gray" dimColor>
            {`      /\\_/\\
     ( - .- )
     (") (")
    /  Zzz \\
   (   |   )
   |   |   |
  ~~~~~~~~~~`}
          </Text>
        </Box>
      )}

      {/* Status */}
      <Box marginTop={1}>
        {isPlaying ? (
          <Text color={lightColor} bold>
            ♪ ~(=^･ω･^)ノ ♪
          </Text>
        ) : (
          <Text dimColor>( ˘ω˘ ) Zzz</Text>
        )}
      </Box>

      {/* Paw prints */}
      {isPlaying && (
        <Box marginTop={1}>
          <Text color="gray" dimColor>
            🐾 🐾
          </Text>
        </Box>
      )}
    </Box>
  );
}
