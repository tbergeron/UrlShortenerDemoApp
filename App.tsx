import React from "react";
import {
  Text,
  Heading,
  NativeBaseProvider,
  StatusBar,
  Box,
  Button,
  VStack,
  FormControl,
  Input,
  Center
} from "native-base";

function AppBar() {
  return <>
      <StatusBar barStyle="light-content" />
      <Box safeAreaTop bg="blue.600" />
      <Box bg="blue.800" px="1" py="3">
        <Center>
          <Text color="white" fontSize="20" fontWeight="bold" textAlign="center">
            Shortly
          </Text>
        </Center>
      </Box>
    </>;
}

function ShortenerForm() {
  const [formData, setData] = React.useState({});
  const [errors, setErrors] = React.useState({});

  const validate = () => {
    setErrors({});
    if (formData.url === undefined) {
      setErrors({ ...errors, url: 'URL is required' });
      return false;
    } else if (formData.url.length < 3) {
      setErrors({ ...errors, url: 'URL is too short' });
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    validate() ? console.log('Submitted') : console.log('Validation Failed');
  };

  return <VStack mx="10" mt="10">
    <FormControl isRequired isInvalid={'url' in errors}>

      <FormControl.Label _text={{ bold: true }}>URL</FormControl.Label>

      <Input placeholder="https://..."
        onChangeText={value => setData({ ...formData, url: value })} />

      {'url' in errors ? <FormControl.ErrorMessage>URL should contain atleast 3 character.</FormControl.ErrorMessage> : ""}

    </FormControl>

    <Button onPress={onSubmit} mt="5" colorScheme="blue">
      Make it short!
    </Button>

  </VStack>;
}

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