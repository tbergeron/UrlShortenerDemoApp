import React from "react";
import {
  Text,
  Heading,
  NativeBaseProvider,
  Box
} from "native-base";
import AppBar from "./components/AppBar/AppBar";
import ShortenerForm from "./components/ShortenerForm/ShortenerForm";

export default function App() {
  return (
    <NativeBaseProvider>

      <AppBar />

      <Box px="10">
        <Heading mt="10">
          Gotta shrink that
          <Text color="blue.500"> motherfucking URL!</Text>
        </Heading>
        <Text mt="3" fontWeight="medium">
          Enter an URL in the field below and press the shorten button to proceed.
        </Text>
      </Box>

      <ShortenerForm />

    </NativeBaseProvider>
  );
}