import { Dimensions } from 'react-native';
import {
  Button,
  VStack,
  Text,
  Box,
  HStack,
  Spacer,
  Link,
  View,
  Pressable
} from "native-base";
import * as Clipboard from 'expo-clipboard';
import { GestureResponderEvent } from "react-native";
import { SwipeListView } from 'react-native-swipe-list-view';
import { ShortUrl } from '../ShortenerForm/ShortenerForm';

interface ShortenedUrlListProps {
  displayAlert: Function;
  removeItem  : Function;
  items       : Array<ShortUrl>;
}

export default function ShortenedUrlList(props: ShortenedUrlListProps) {

  const copyToClipboard = async (event: GestureResponderEvent, item: ShortUrl) => {
    event.preventDefault();
    await Clipboard.setStringAsync(item.shortUrl);
    props.displayAlert('info', 'Copied to clipboard!');
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    props.removeItem(props.items[rowKey]);
  };

  const renderItem = data => (
    <Pressable bg="white">
        <View>
          <Box px="10" py="2" key={data.item.code}>
            <HStack space={[2, 3]} justifyContent="space-between">
              <VStack>
                <Text color="coolGray.600">
                  <Link href={data.item.shortUrl}>{data.item.shortUrl}</Link>
                </Text>
                <Spacer />
                <Text fontSize="xs" color="coolGray.800" ellipsizeMode='tail' numberOfLines={1} width={Dimensions.get('window').width-160}>
                  {data.item.originalLink}
                </Text>
              </VStack>
              <Spacer />
              <Button colorScheme="blue" onPress={(event) => copyToClipboard(event, data.item)}>Copy</Button>
            </HStack>
          </Box>
        </View>
    </Pressable>
  );

  const renderHiddenItem = (data, rowMap) => (
    <HStack flex="1" pl="2">
      <Pressable w="70" ml="auto" bg="white">
      </Pressable>
      <Pressable w="70" bg="red.500" justifyContent="center"
        onPress={() => deleteRow(rowMap, data.index)} _pressed={{ opacity: 0.5 }}
      >
        <VStack alignItems="center" space={2}>
          <Text color="white" fontSize="xs" fontWeight="medium">
            Delete
          </Text>
        </VStack>
      </Pressable>
    </HStack>
  );

  return (
    <View mb="10">
      <SwipeListView
        height={Dimensions.get('window').height-520}
        data={props.items}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-70}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}