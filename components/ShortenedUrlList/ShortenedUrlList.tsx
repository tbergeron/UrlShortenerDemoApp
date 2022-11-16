import React, { useState, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    TouchableHighlight
} from 'react-native';
import {
  Button,
  VStack,
  Heading,
  Text,
  Box,
  HStack,
  Spacer,
  Link,
  View
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

  const rowTranslateAnimatedValues = {};

  props.items
    .forEach((_, i) => {
      rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
    });

  const copyToClipboard = async (event: GestureResponderEvent, item: ShortUrl) => {
    event.preventDefault();
    await Clipboard.setStringAsync(item.shortUrl);
    props.displayAlert('info', 'Copied to clipboard!');
  };

  const animationIsRunning = useRef(false);

  const onSwipeValueChange = swipeData => {
    const { key, value } = swipeData;
    if (value < -Dimensions.get('window').width && !animationIsRunning.current) {
      animationIsRunning.current = true;

      // TODO: this should animate the red cell back to its initial position?

      Animated.timing(rowTranslateAnimatedValues[`${key}`], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {

        // TODO: this gets fired multiple times
        // is it because of the list's width?

        console.log('Telling parent component to delete:', key, props.items[key]);
        props.removeItem(props.items[key]);
        animationIsRunning.current = false;
      });
    }
  };

  // TODO: delete cell remains opened after deletetion
  const renderItem = data => (
    <Animated.View

      // TODO: this animates the cell upward when it disappears

      // style={{
      //   height: rowTranslateAnimatedValues[data.item.key].interpolate({
      //     inputRange: [0, 1],
      //     outputRange: [0, 50],
      //   }),
      // }}
    >
      <TouchableHighlight style={styles.rowFront}>
        <View>

          <Box pl={["0", "4"]} pr={["0", "5"]} py="2" key={data.item.code}>
            <HStack space={[2, 3]} justifyContent="space-between">
              <VStack>
                <Text color="coolGray.600">
                  <Link href={data.item.shortUrl}>{data.item.shortUrl}</Link>
                </Text>
                <Spacer />
                <Text fontSize="xs" color="coolGray.800" ellipsizeMode='tail' numberOfLines={1} width="270px">
                  {data.item.originalLink}
                </Text>
              </VStack>
              <Spacer />
              <Button colorScheme="blue" onPress={(event) => copyToClipboard(event, data.item)}>Copy</Button>
            </HStack>
          </Box>

        </View>
      </TouchableHighlight>
    </Animated.View>
  );

  const renderHiddenItem = () => (
    <View style={styles.rowBack}>
      <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
        <Text style={styles.backTextWhite}>Delete</Text>
      </View>
    </View>
  );

  return (
    <View mb="10">

      <SwipeListView
        disableRightSwipe
        height={Dimensions.get('window').height-520}
        data={props.items}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-Dimensions.get('window').width}
        onSwipeValueChange={onSwipeValueChange}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        useNativeDriver={false}
        keyExtractor={(item, index) => index.toString()}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
});