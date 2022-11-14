import {
  Text,
  StatusBar,
  Box,
  Center
} from "native-base";

export default function AppBar() {
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