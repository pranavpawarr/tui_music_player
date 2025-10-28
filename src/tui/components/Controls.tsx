import React from "react";
import { Box, Text } from "ink";
import Gradient from "ink-gradient";

export function Controls() {
  return (
    <Box
      flexDirection="column"
      borderStyle="bold"
      borderColor="cyan"
      paddingX={2}
      paddingY={1}
    >
      <Box justifyContent="center" marginBottom={1}>
        <Gradient name="teen">
          <Text bold>KEYBOARD CONTROLS</Text>
        </Gradient>
      </Box>

      <Box flexDirection="column" paddingX={1}>
        {/* Playback Controls */}
        <Box>
          <Box width={25}>
            <Text color="green" bold>
              ␣ Space
            </Text>
          </Box>
          <Text>Play / Pause</Text>
        </Box>

        <Box>
          <Box width={25}>
            <Text color="green" bold>
              ← → (or P/N)
            </Text>
          </Box>
          <Text>Previous / Next Track</Text>
        </Box>

        <Box>
          <Box width={25}>
            <Text color="green" bold>
              R
            </Text>
          </Box>
          <Text>Restart Current Track</Text>
        </Box>

        {/* Volume Controls */}
        <Box marginTop={1}>
          <Box width={25}>
            <Text color="yellow" bold>
              ↑ ↓ (or +/-)
            </Text>
          </Box>
          <Text>Volume Up / Down</Text>
        </Box>

        {/* View Controls */}
        <Box marginTop={1}>
          <Box width={25}>
            <Text color="magenta" bold>
              L
            </Text>
          </Box>
          <Text>Toggle Queue List</Text>
        </Box>

        <Box>
          <Box width={25}>
            <Text color="cyan" bold>
              H
            </Text>
          </Box>
          <Text>Toggle Help</Text>
        </Box>

        <Box>
          <Box width={25}>
            <Text color="red" bold>
              Q
            </Text>
          </Box>
          <Text>Quit Application</Text>
        </Box>
      </Box>
    </Box>
  );
}
