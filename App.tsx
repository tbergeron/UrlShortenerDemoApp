import React from "react";
import {
  Text,
  Heading,
  NativeBaseProvider,
  Box
} from "native-base";
import AppBar from "./components/AppBar/AppBar";
import CollapsibleAlert from "./components/CollapsibleAlert/CollapsibleAlert";
import ShortenerForm from "./components/ShortenerForm/ShortenerForm";

export default function App() {
  const [isShowingAlert, setIsShowingAlert] = React.useState(false);
  const [alertType,      setAlertType]      = React.useState('');
  const [alertMessage,   setAlertMessage]   = React.useState('');

  const displayAlert = (alertType: string, alertMessage: string) => {
    setIsShowingAlert(true);
    setAlertType(alertType);
    setAlertMessage(alertMessage);
    setTimeout(() => setIsShowingAlert(false), 3000);
  };

  return (
    <NativeBaseProvider>

      <AppBar />

      <CollapsibleAlert isShowingAlert={isShowingAlert} alertType={alertType} alertMessage={alertMessage} />

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