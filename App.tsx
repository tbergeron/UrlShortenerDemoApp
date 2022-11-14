import React from "react";
import {
  Text,
  Heading,
  NativeBaseProvider,
  Box,
  HStack,
  Alert,
  VStack,
  Collapse
} from "native-base";
import AppBar from "./components/AppBar/AppBar";
import ShortenerForm from "./components/ShortenerForm/ShortenerForm";

export default function App() {
  const [isShowingAlert, setIsShowingAlert] = React.useState(false);
  const [alertType, setAlertType] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');
  const displayAlert = (alertType: string, alertMessage: string) => {
    setIsShowingAlert(true);
    setAlertType(alertType);
    setAlertMessage(alertMessage);
    // fade out and hide alert
    setTimeout(() => setIsShowingAlert(false), 3500);
  };

  return (
    <NativeBaseProvider>

      <AppBar />

      <Collapse isOpen={isShowingAlert}>
        <Alert w="100%" variant="top-accent" colorScheme={alertType} status={alertType} rounded="none">
          <VStack space={2} flexShrink={1} w="100%">
            <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
              <HStack space={2} flexShrink={1} alignItems="center">
                <Alert.Icon />
                <Text>
                {alertMessage}
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </Alert>
      </Collapse>

      <Box px="10">
        <Heading mt="10">
          Gotta shrink that
          <Text color="blue.500"> motherfucking URL!</Text>
        </Heading>
        <Text mt="3" fontWeight="medium">
          Enter an URL in the field below and press the shorten button to proceed.
        </Text>
      </Box>

      <ShortenerForm displayAlert={displayAlert} />

    </NativeBaseProvider>
  );
}