import {
  Heading,
  Box,
  Spinner,
  HStack
} from "native-base";

interface LoadingIndicatorProps {
  isShowingLoading: boolean;
}

export default function LoadingIndicator(props: LoadingIndicatorProps) {
  return (
    <>
      {props.isShowingLoading ?
      <Box justifyContent="center" alignItems="center" flexDirection="row">
        <Box zIndex={2} position="absolute" top="4">
          <HStack space={2} justifyContent="center">
            <Spinner />
            <Heading color="primary.500" fontSize="md">
              Loading
            </Heading>
          </HStack>
        </Box>
      </Box>
      : null}
    </>
  );
}