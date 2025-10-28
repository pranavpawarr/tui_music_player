import React from "react";
import { render, Text, Box } from "ink";

const TestApp = () => (
  <Box padding={1}>
    <Text color="green">✓ Ink is working!</Text>
  </Box>
);

render(<TestApp />);
