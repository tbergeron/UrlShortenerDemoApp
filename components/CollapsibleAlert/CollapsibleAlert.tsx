import React from "react";
import {
  Collapse,
  Alert,
  HStack,
  VStack,
  Text
} from "native-base";

interface CollapsibleAlertProps {
  isShowingAlert: boolean;
  alertType     : string;
  alertMessage  : string;
}

export default function CollapsibleAlert(props: CollapsibleAlertProps) {
  return (
  <Collapse isOpen={props.isShowingAlert}>
    <Alert w="100%" variant="top-accent" colorScheme={props.alertType} status={props.alertType} rounded="none">
      <VStack space={2} flexShrink={1} w="100%">
        <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text>
            {props.alertMessage}
            </Text>
          </HStack>
        </HStack>
      </VStack>
    </Alert>
  </Collapse>
  );
}